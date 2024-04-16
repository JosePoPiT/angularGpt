import { environment } from "environments/environment";
import { ProsConsInterface } from "@interfaces/pros-cons.response";

export const proConsUseCase = async (prompt: string) => {
    try {
        const resp = await fetch(`${ environment.backendApi }/pros-cons-discusser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });

        if (!resp.ok) {
             throw new Error('No se pudo realizar la comparacion')   
        }

        const data= await resp.json() as ProsConsInterface;

        return {
            ok: true,
            ...data
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            role: '',
            content: 'No se pudo realizar la comparacion'
        }
        
    }
}