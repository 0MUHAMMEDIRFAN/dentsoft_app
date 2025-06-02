import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getPatientList = (searchTerm?: string) => {
    const filters: any[] = [];
    if (searchTerm) {
        filters.push(
            ["patient_name", "like", `%${searchTerm}%`]
        );
    }
    const { data, error, isLoading, mutate } = useFrappeGetDocList('Patient', {
        fields: ["name", "patient_name", "dob", "phone", "mobile"], // Optional: Specify fields to retrieve
        filters, // Optional: Add filters
        limit: 20, // Optional: Limit the number of results
        orderBy: { field: "modified", order: "desc" } // Optional: Sort results
    });

    return { data, isLoading, error, mutate };

};
