import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeUpdateDoc, useFrappeDeleteDoc } from 'frappe-react-sdk';
import { useCallback } from 'react';

export const getRoleProfileList = (searchTerm?: string | undefined) => {
    const filters: any[] = [];
    if (searchTerm) {
        filters.push(["role_profile", "like", `%${searchTerm}%`]);
    }

    const { data, error, isLoading, mutate } = useFrappeGetDocList('Role Profile', {
        fields: ["*"],
        filters,
        limit: 20,
        orderBy: { field: "modified", order: "desc" }
    });

    return {
        data: data || [],
        isLoading,
        error,
        mutate
    };
};

export const useRoleOperations = () => {
    const { createDoc, loading: createLoading } = useFrappeCreateDoc()
    const { updateDoc, loading: updateLoading } = useFrappeUpdateDoc()
    const { deleteDoc, loading: deleteLoading } = useFrappeDeleteDoc()

    const addRole = useCallback(async (formData: any) => {
        const result = await createDoc('Role Profile', formData)
        return result
    }, [createDoc])

    const editRole = useCallback(async (id: string, formData: any) => {
        const result = await updateDoc('Role Profile', id, formData)
        return result
    }, [updateDoc])

    const removeRole = useCallback(async (id: string) => {
        const result = await deleteDoc('Role Profile', id)
        return result
    }, [deleteDoc])

    return {
        addRole,
        editRole,
        removeRole,
        loading: {
            create: createLoading,
            update: updateLoading,
            delete: deleteLoading
        }
    }
}

