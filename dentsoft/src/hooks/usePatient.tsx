import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getPatientList = (searchTerm: string | undefined) => {
    const { data, error, isLoading } = useFrappeGetDocList('Patient', {
        fields: ["name", "patient_name", "dob","phone","mobile"], // Optional: Specify fields to retrieve
        filters: [["patient_name", "like", searchTerm || ""]], // Optional: Add filters
        limit: 20, // Optional: Limit the number of results
        orderBy: { field: "modified", order: "desc" } // Optional: Sort results
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (

        {
            data
            //     && data.map(doc => (

            //     { doc.name } - { doc.field1 }

            // ))
        }

    );
};
