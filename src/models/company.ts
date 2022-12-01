interface ICompanyConstructor {
    id: number | string;
    title: string; 
    body: string; 
    count?: number; 
    check?: string;
};

export default class Company {
    constructor({ id, title, body, count = undefined, check = "" }: ICompanyConstructor) {
        return {
            id: id + "-company",
            title: title.slice(0, 10),
            count: count === 0 ? count : Math.floor(Math.random() * 10), // рандомное число сотрудников до 300
            address: body.slice(0, 10),
            check
        };
    };
};