import React from "react";
import { v4 as uuid } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import request from "../../api/request";
import { FAKE_URL, LIMIT } from "../../config";
import { tableCompaniesHeader } from "../../config";
import Company from "../../models/company";
import { addCompany, changeCheck, deleteCompany, editCompany, selectCompaniesState, setCompanies } from "../../store/companies/slice";
import { ICompany, IUser } from "../../types";
import Table from "../table";
import { selectUsersState, setCompany } from "../../store/users/slice";

export default function Companies() {
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [editValue, setEditValue] = React.useState<ICompany | null>(null);
    const [visibleDelete, setVisibleDelete] = React.useState<string[]>([]);
    const [allChecked, setAllChecked] = React.useState(false);

    const { companies } = useSelector(selectCompaniesState);
    const { company } = useSelector(selectUsersState);
    const dispatch = useDispatch();

    const scrollableRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        return () => {
            dispatch(setCompanies([]));
            setEditValue(null);
            setVisibleDelete([]);
            setAllChecked(false);
            setLoading(false);
        }
    }, [dispatch]);

    // Загрузка записей
    React.useEffect(() => {
        request({ url: FAKE_URL + `posts?_start=${page}&_limit=${LIMIT}`, setLoading: page ? undefined : setLoading })
            .then(companies => {
                if (companies && companies.length) {
                    dispatch(setCompanies(companies.map(company => new Company(company) as ICompany)));
                }
            });
    }, [page, dispatch]);

    React.useEffect(() => {
        if (companies && companies.length) {
            const deleteIds = companies.reduce((acc, company) => {
                if (company.check) {
                    acc.push(company.id);
                }

                return acc;
            }, [] as string[]);

            if (deleteIds && deleteIds.length) {
                setVisibleDelete(deleteIds);
            }

            setAllChecked(!Boolean(companies.some(company => !company.check)));
        } else {
            setAllChecked(false);
        }

        return () => {
            setVisibleDelete([]);
        }
    }, [companies]);

    const onAdd = React.useCallback(() => {
        const newCompany = new Company({ id: uuid(), title: "", body: "", count: 0 }) as ICompany;
        dispatch(addCompany(newCompany));
        setEditValue(newCompany);

        if (scrollableRef.current) {
            scrollableRef.current.scrollTop = 0;
        }
    }, [scrollableRef, dispatch]);

    const onSave = React.useCallback(() => {
        if (editValue) {
            dispatch(editCompany(editValue));
            setEditValue(null);
        }
    }, [editValue, dispatch]);

    const onEdit = React.useCallback((company: IUser | ICompany) => {
        setEditValue(company as ICompany);
    }, []);

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>, key: keyof ICompany) => {
        if (editValue) {
            setEditValue({ ...editValue, [key]: e.target.value });
        }
    }, [editValue]);

    const onDelete = React.useCallback((id: string) => {
        if (editValue && editValue.id === id) {
            setEditValue(null);
        }

        if (company && company.id === id) {
            dispatch(setCompany(null));
        }

        dispatch(deleteCompany(id));
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

        if (companies && companies.length) {
            for (let i = 0; i < companies.length; i++) {
                dispatch(changeCheck({ id: companies[i].id, isCheck: e.target.checked }));
            }
        }
    }, [companies, dispatch]);

    const getUsers = React.useCallback((company: ICompany) => {
        dispatch(setCompany(company));
    }, [dispatch]);

    return <Table
        loading={loading}
        tableTitle="Список компаний"
        visibleDelete={visibleDelete}
        scrollableRef={scrollableRef}
        tableHeader={tableCompaniesHeader}
        editValue={editValue}
        allChecked={allChecked}
        idLoadMore="load-more-companies"
        data={companies}
        onAdd={onAdd}
        onDeleteFew={onDeleteFew}
        selectAll={selectAll}
        getUsers={getUsers}
        onChangeCheck={onChangeCheck}
        onChange={onChange}
        onSave={onSave}
        onEdit={onEdit}
        onDelete={onDelete}
        setPage={setPage}
    />
};