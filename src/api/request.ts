import { HTTP_METHODS } from "../types/enums";

interface IRequest {
    url: string;
    method?: HTTP_METHODS;
    body?: object;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default async function request({ url, method = HTTP_METHODS.GET, body, setLoading }: IRequest): Promise<any[] | null> {
    try {
        if (setLoading) setLoading(true);

        const response = await fetch(url, {
            method,
            body: body ? JSON.stringify(body) : undefined
        });
    
        return response.json();
    } catch (error) {
        console.error(`При загрузке данных с ${url} возникла ошибка: ${error}`);
        return null;
    }
    finally {
        if (setLoading) setLoading(false);
    }
};