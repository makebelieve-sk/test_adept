import React from "react";
import { LIMIT } from "../../../config";
import { ICompany, IUser } from "../../../types";

import "./tbody.css";

export interface ITBody {
    data: (ICompany | IUser)[];
    editValue: ICompany | IUser | null;
    scrollableRef: React.MutableRefObject<HTMLDivElement | null>;
    idLoadMore: string;
    onChangeCheck: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, key: keyof ICompany) => void;
    onSave: () => void;
    onEdit: (element: ICompany | IUser) => void;
    onDelete: (id: string) => void;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    getUsers?: (company: ICompany) => void;
};

export default function TBody({ 
    data, editValue, scrollableRef, idLoadMore,
    onChangeCheck, onChange, onSave, onEdit, onDelete, setPage, getUsers 
}: ITBody) {
    const [isLoadMore, setIsLoadMore] = React.useState(false);
    const [isClicked, setIsClicked] = React.useState("");

    React.useEffect(() => {
        setIsLoadMore(false);
    }, [data]);

    // Динамическая подгрузка записей
    React.useEffect(() => {
        const myRef = scrollableRef.current;

        const onScroll = () => {
            if (myRef) {
                const top = myRef.getBoundingClientRect().top;
                const height = myRef.clientHeight;
                const loadMore = document.getElementById(idLoadMore);
    
                if (loadMore) {
                    if ((loadMore.getBoundingClientRect().top - height - top < 100) && !isLoadMore) {                        
                        setIsLoadMore(true);
                        setPage(prev => prev + LIMIT);
                    }
                }
            }
        };

        myRef?.addEventListener("scroll", onScroll);

        return () => {
            myRef?.removeEventListener("scroll", onScroll);
        }
    }, [idLoadMore, scrollableRef, isLoadMore, setPage, setIsLoadMore]);

    const saveHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        onSave();
    };

    const editHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, element: ICompany | IUser) => {
        e.stopPropagation();

        onEdit(element);
    };

    const deleteHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
        e.stopPropagation();

        onDelete(id);
    };

    const clickHandler = (element: ICompany) => {
        if (getUsers) {
            setIsClicked(element.id);
            getUsers(element);
        }
    };

    return <>
        {data.map(element => {
            return <tr 
                key={element.id} 
                className={`${isClicked && isClicked === element.id ? "clicked" : ""} ${element.check}`} 
                onClick={_ => clickHandler(element as ICompany)}
            >
                {Object.keys(element).map(key => {
                    if (key !== "check") {
                        return <td key={element.id + " " + key}>
                            {key === "id"
                                ? <input
                                    type="checkbox"
                                    checked={Boolean(element.check)}
                                    disabled={Boolean(editValue && editValue.id === element.id)}
                                    onChange={e => onChangeCheck(e, element.id)}
                                    onClick={e => e.stopPropagation()}
                                />
                                : editValue && editValue.id === element.id && key !== "count"
                                    ? <input
                                        type="text"
                                        className="edit-input"
                                        value={editValue[key]}
                                        onChange={e => onChange(e, key)}
                                        onClick={e => e.stopPropagation()}
                                    />
                                    : element[key]
                            }
                        </td>
                    }

                    return null;
                })}

                <td key={element.id + " delete"} className="buttons-actions">
                    {editValue && editValue.id === element.id
                        ? <button className="edit-button" onClick={saveHandler}>
                            Сохранить
                        </button>
                        : <button className="edit-button" onClick={e => editHandler(e, element)}>
                            Редактировать
                        </button>}
                    <button onClick={e => deleteHandler(e, element.id)}>Удалить</button>
                </td>
            </tr>
        })}
    </>;
};