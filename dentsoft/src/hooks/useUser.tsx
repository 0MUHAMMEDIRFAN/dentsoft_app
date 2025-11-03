import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeUpdateDoc, useFrappeDeleteDoc, useSearch } from 'frappe-react-sdk';
import { useCallback } from 'react';

export const getUserList = (searchTerm?: string, active?: boolean, size: number = 15, role?: string) => {
    // Build filters array dynamically
    const filters: any[] = [];
    if (searchTerm) {
        filters.push(["full_name", "like", `%${searchTerm}%`]);
    }
    if (active !== undefined) {
        filters.push(["enabled", "=", active]);
    }
    if (role) {
        filters.push(["role_profile_name", "=", role]);
    }

    const { data, error, isLoading, mutate } = useFrappeGetDocList('User', {
        fields: ["name", "full_name", "email", "enabled", "phone", "gender", "user_type", "role_profile_name", "last_login"],
        filters,
        limit: size,
        orderBy: { field: "modified", order: "desc" }
    });

    return ({ data, isLoading, error, mutate });
};

export const useUserOperations = () => {
    const { createDoc, loading: createLoading } = useFrappeCreateDoc()
    const { updateDoc, loading: updateLoading } = useFrappeUpdateDoc()
    const { deleteDoc, loading: deleteLoading } = useFrappeDeleteDoc()

    const addUser = useCallback(async (formData: any) => {
        const result = await createDoc('User', formData)
        return result
    }, [createDoc])

    const editUser = useCallback(async (id: string, formData: any) => {
        const result = await updateDoc('User', id, formData)
        return result
    }, [updateDoc])

    const removeUser = useCallback(async (id: string) => {
        const result = await deleteDoc('User', id)
        return result
    }, [deleteDoc])

    return {
        addUser,
        editUser,
        removeUser,
        loading: {
            create: createLoading,
            update: updateLoading,
            delete: deleteLoading
        }
    }
}

export const searchUser = (searchTerm: string = "") => {
    const { data, error, isLoading, mutate } = useSearch('User', searchTerm, [], 20);
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        data?.message
    );
}


export const createUser = () => {
    const { createDoc, isCompleted, error, loading } = useFrappeCreateDoc();
    const newUser = {
        first_name: "John Doe",
        email: "johndoe@example.com",
        // enabled: 1,
        phone: "1234567890",
        gender: "Male",
        // user_type: "System User",
        // role_profile_name: "Employee",
    };


    if (loading) return <p>Creating user...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (isCompleted) return <p>User created successfully!</p>;

    return (true);
}

export const getActivityLog = (date?: string, referenceDoctype?: string, referenceName?: string, size: number = 15) => {
    const filters: any[] = [];
    if (referenceDoctype) {
        filters.push(["reference_doctype", "=", referenceDoctype]);
    }
    if (referenceName) {
        filters.push(["reference_name", "=", referenceName]);
    }
    if (date) {
        filters.push(["creation", "Between", [date,date]]);
    }

    const { data, error, isLoading ,mutate} = useFrappeGetDocList('Activity Log', {
        fields: ["communication_date", "modified", "subject", "creation", "ip_address", "operation", "status", "user"],
        filters,
        limit: size,
        orderBy: { field: "creation", order: "desc" }
    });

    return ({ data, isLoading, error ,mutate});
};
