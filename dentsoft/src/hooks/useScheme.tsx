import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeUpdateDoc, useFrappeDeleteDoc } from 'frappe-react-sdk';
import { useCallback } from 'react';

export const getSchemeList = (searchTerm?: string, active?: boolean, patient?: string) => {
    const filters: any[] = [];
    if (searchTerm) {
        filters.push(
            ["name", "like", `%${searchTerm}%`],
            ["payment_term_name", "like", `%${searchTerm}%`]
        );
    }
    if (patient) {
        filters.push(["patient", "=", patient]);
    }
    if (active !== undefined) {
        filters.push(["custom_disabled", "=", active ? 0 : 1]);
    }
    
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Payment Term',
        {
            fields: ['*'],
            filters,
            orderBy: {
                field: 'creation',
                order: 'desc'
            }
        }
    );
    return { data, isLoading, error, mutate };
};

export const useSchemeOperations = () => {
    const { createDoc, loading: createLoading } = useFrappeCreateDoc()
    const { updateDoc, loading: updateLoading } = useFrappeUpdateDoc()
    const { deleteDoc, loading: deleteLoading } = useFrappeDeleteDoc()

    const addScheme = useCallback(async (formData: any) => {
        const payload = {
            ...formData,
            discount: Number(formData.discount),
            discount_validity: Number(formData.discount_validity)
        }
        const result = await createDoc('Payment Term', payload)
        return result
    }, [createDoc])

    const editScheme = useCallback(async (id: string, formData: any) => {
        const payload = {
            ...formData,
            discount: Number(formData.discount),
            discount_validity: Number(formData.discount_validity)
        }
        const result = await updateDoc('Payment Term', id, payload)
        return result
    }, [updateDoc])

    const removeScheme = useCallback(async (id: string) => {
        const result = await deleteDoc('Payment Term', id)
        return result
    }, [deleteDoc])

    return {
        addScheme,
        editScheme,
        removeScheme,
        loading: {
            create: createLoading,
            update: updateLoading,
            delete: deleteLoading
        }
    }
}
