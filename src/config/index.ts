import { v4 as uuid } from "uuid";

export const tableCompaniesHeader = [
    { id: uuid(), title: "" }, 
    { id: uuid(), title: "Название компании" }, 
    { id: uuid(), title: "Кол-во сотрудников" },
    { id: uuid(), title: "Адрес" },
    { id: uuid(), title: "" },
];

export const tableUsersHeader = [
    { id: uuid(), title: "" }, 
    { id: uuid(), title: "Фамилия" }, 
    { id: uuid(), title: "Имя" },
    { id: uuid(), title: "Должность" },
    { id: uuid(), title: "" },
];

export const FAKE_URL = "https://jsonplaceholder.typicode.com/";
export const LIMIT = 20;