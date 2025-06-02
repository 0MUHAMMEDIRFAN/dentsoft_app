import { useFrappeGetDocList, useFrappeCreateDoc } from 'frappe-react-sdk';

export const getRoleProfileList = (searchTerm?: string | undefined) => {
    const { data, error, isLoading, mutate } = useFrappeGetDocList('Role Profile', {
        fields: ["*"], // Optional: Specify fields to retrieve
        filters: [["role_profile", "like", `%${searchTerm}%`]], // Optional: Add filters
        limit: 20, // Optional: Limit the number of results
        orderBy: { field: "modified", order: "desc" } // Optional: Sort results
    });

    // if (isLoading) return [];
    // if (error) return [];
    return (

        {
            data: data || [],
            isLoading,
            error,
            mutate
        }

    );
};

