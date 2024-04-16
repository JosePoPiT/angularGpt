import { environment } from "environments/environment";
import type { OrthographyInterface } from '../../../interfaces/orthography.response';

export const orthographyUseCase = async (prompt: string) => {
    try {
        const resp = await fetch(`${ environment.backendApi }/orthography-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!resp.ok) {
             throw new Error('No se pudo realizar la corrección')   
        }

        const data= await resp.json() as OrthographyInterface;

        return {
            ok: true,
            ...data
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'No se pudo realizar la corrección'
        }
        
    }
}