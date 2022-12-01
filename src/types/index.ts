interface ICompany {
    id: string;
    title: string;
    address: string;
    count: number;
    check: string;
    [key: string]: string | number;
};

interface IUser {
    id: string;
    surName: string;
    name: string;
    position: string;
    check?: string;
    companyId?: string;
    [key: string]: string | undefined;
};

export type {
    ICompany,
    IUser,
};