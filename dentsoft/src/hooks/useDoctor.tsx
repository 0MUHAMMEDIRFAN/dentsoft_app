import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getDoctorList = (searchTerm: string | undefined) => {
    const { data, error, isLoading } = useFrappeGetDocList('Healthcare Practitioner', {
        fields: ["name", "practitioner_name", "email_id", "status", "mobile_phone", "gender", "appointments", "practitioner_type"], // Optional: Specify fields to retrieve
        // filters: [["full_name", "=", searchTerm || ""]], // Optional: Add filters
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
