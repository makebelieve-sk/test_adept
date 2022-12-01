import React from "react";
import { v4 as uuid } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { LIMIT, tableUsersHeader } from "../../config";
import { setUsers, editUser, addUser, deleteUser, changeCheck, selectUsersState } from "../../store/users/slice";
import { ICompany, IUser } from "../../types";
import Table from "../table";
import User from "../../models/user";
import { UsersData } from "../../api/users";

import "./users.css";
import { changeCount } from "../../store/companies/slice";

export default function Users() {
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [editValue, setEditValue] = React.useState<IUser | null>(null);
    const [visibleDelete, setVisibleDelete] = React.useState<string[]>([]);
    const [allChecked, setAllChecked] = React.useState(false);
    const [currentCompany, setCurrentCompany] = React.useState<ICompany | null>(null);
    const [visible, setVisible] = React.useState(false);

    const { users, company } = useSelector(selectUsersState);
    const dispatch = useDispatch();

    const scrollableRef = React.useRef<HTMLDivElement | null>(null);
    const timerRef = React.useRef<any>(null);

    React.useEffect(() => {
        return () => {
            dispatch(setUsers([]));
            setEditValue(null);
            setVisibleDelete([]);
            setAllChecked(false);
            setLoading(false);
        }
    }, [dispatch]);

    React.useEffect(() => {
        if (company) {
            dispatch(setUsers([]));
            setCurrentCompany(company);
            setPage(0);
            setVisible(true);
            setLoading(true);
        } else {
            setVisible(false);
        }
    }, [company, dispatch]);

    // Загрузка записей
    React.useEffect(() => {
        if (currentCompany) {
            const shuffle = (a: any[]) => {
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }

                return a;
            };

            const myPromise = new Promise<IUser[]>((resolve) => {
                const users = UsersData.filter(user => user.companyId === currentCompany.id);

                if (!users || !users.length) {
                    users.splice(0, 0, ...shuffle(UsersData));
                }

                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }

                timerRef.current = setTimeout(() => {
                    resolve(users.slice(page, currentCompany.count - page > LIMIT ? page + LIMIT : currentCompany.count));
                    setLoading(false);
                }, 1000);
            });

            myPromise.then((users: IUser[]) => {
                if (users && users.length) {
                    dispatch(setUsers(users.map(user => new User({
                        id: user.id,
                        surName: user.surName,
                        name: user.name,
                        position: user.position
                    }) as IUser)));
                }
            });
        }
    }, [currentCompany, page, dispatch]);

    React.useEffect(() => {
        if (users && users.length) {
            const deleteIds = users.reduce((acc, user) => {
                if (user.check) {
                    acc.push(user.id);
                }

                return acc;
            }, [] as string[]);

            if (deleteIds && deleteIds.length) {
                setVisibleDelete(deleteIds);
            }

            setAllChecked(!Boolean(users.some(company => !company.check)));
        } else {
            setAllChecked(false);
        }

        return () => {
            setVisibleDelete([]);
        }
    }, [users]);

    const onAdd = React.useCallback(() => {
        const newUser = new User({ id: uuid(), surName: "", name: " ", position: "" }) as IUser;
        dispatch(addUser(newUser));

        if (company) {
            dispatch(changeCount({ count: 1, id: company.id }));
        }
        
        setEditValue(newUser);

        if (scrollableRef.current) {
            scrollableRef.current.scrollTop = 0;
        }
    }, [scrollableRef, company, dispatch]);

    const onSave = React.useCallback(() => {
        if (editValue) {
            dispatch(editUser(editValue));
            setEditValue(null);
        }
    }, [editValue, dispatch]);

    const onEdit = React.useCallback((user: IUser | ICompany) => {
        setEditValue(user as IUser);
    }, []);

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, key: keyof IUser) => {
        if (editValue) {
            setEditValue({ ...editValue, [key]: e.target.value });
        }
    }, [editValue]);

    const onDelete = React.useCallback((id: string) => {
        if (editValue && editValue.id === id) {
            setEditValue(null);
        }

        dispatch(deleteUser(id));

        if (company) {
            dispatch(changeCount({ count: -1, id: company.id }));
        }
    }, [editValue, company, dispatch]);

    const onChangeCheck = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        dispatch(changeCheck({ id, isCheck: e.target.checked }));
    }, [dispatch]);

    const onDeleteFew = React.useCallback(() => {
        if (visibleDelete && visibleDelete.length) {
            for (const id of visibleDelete) {
                onDelete(id);
            }
        }
    }, [visibleDelete, onDelete]);

    const selectAll = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setAllChecked(e.target.checked);

        if (users && users.length) {
            for (let i = 0; i < users.length; i++) {
                dispatch(changeCheck({ id: users[i].id, isCheck: e.target.checked }));
            }
        }
    }, [users, dispatch]);

    if (!visible) {
        return <div className="no-users" />;
    }

    return <Table
        loading={loading}
        tableTitle="Список сотрудников"
        visibleDelete={visibleDelete}
        scrollableRef={scrollableRef}
        tableHeader={tableUsersHeader}
        editValue={editValue}
        allChecked={allChecked}
        idLoadMore="load-more-users"
        data={users}
        onAdd={onAdd}
        onDeleteFew={onDeleteFew}
        selectAll={selectAll}
        onChangeCheck={onChangeCheck}
        onChange={onChange}
        onSave={onSave}
        onEdit={onEdit}
        onDelete={onDelete}
        setPage={setPage}
    />
};