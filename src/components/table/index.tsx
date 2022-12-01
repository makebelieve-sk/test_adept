import React from "react";
import TBody, { ITBody } from "./tbody";

import "./table.css";
import { ICompany } from "../../types";

interface ITable extends ITBody {
    loading: boolean;
    tableTitle: string;
    visibleDelete: string[];
    tableHeader: any[];
    allChecked: boolean;
    onAdd: () => void;
    onDeleteFew: () => void;
    selectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getUsers?: (company: ICompany) => void;
};

export default function Table({ 
    loading, tableTitle, visibleDelete, scrollableRef, tableHeader, editValue, allChecked, idLoadMore, data,
    onAdd, onDeleteFew, selectAll, onChangeCheck, onChange, onSave, onEdit, onDelete, setPage, getUsers
}: ITable) {
    return <div className="table-wrapper">
        {loading
            ? <div className="spinner">Загрузка данных...</div>
            : <div className="table-main">
                <div className="table-title">
                    {tableTitle}
                    <div className="table-title--buttons">
                        <button onClick={onAdd}>Добавить новую запись</button>

                        {visibleDelete && visibleDelete.length
                            ? <button onClick={onDeleteFew}>Удалить выбранные элементы</button>
                            : null
                        }
                    </div>
                </div>

                <div className="scrollable" ref={scrollableRef}>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={tableHeader.length}>
                                    <input type="checkbox" disabled={Boolean(editValue)} checked={allChecked} onChange={selectAll} />
                                    <span>Выделить всё</span>
                                </th>
                            </tr>

                            <tr>
                                {tableHeader.map(header => <th key={header.id}>{header.title}</th>)}
                            </tr>
                        </thead>

                        <tbody>
                            {data && data.length
                                ? <TBody
                                    data={data}
                                    editValue={editValue}
                                    scrollableRef={scrollableRef}
                                    idLoadMore={idLoadMore}
                                    onChangeCheck={onChangeCheck}
                                    onChange={onChange}
                                    onSave={onSave}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    setPage={setPage}
                                    getUsers={getUsers}
                                />
                                : null
                            }
                            <tr id={idLoadMore} />
                        </tbody>
                    </table>
                </div>
            </div>
        }
    </div>
};