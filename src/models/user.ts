interface IUserConstructor {
    id: number | string;
    surName: string;
    name: string;
    position: string;
    check?: string;
};

export default class User {
    constructor({ id, surName, name, position, check = "" }: IUserConstructor) {
        return {
            id: id + "-user",
            surName,
            name,
            position: position.slice(0, 10),
            check
        };
    };
};