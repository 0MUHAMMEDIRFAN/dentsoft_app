import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getTreatmentList = (searchTerm: string | undefined, patient: string | undefined) => {
    const { data, error, isLoading } = useFrappeGetDocList(
        'Clinical Procedure Template',
        {
            fields: ['*'],
            // filters: [['patient', '=', patient || ""]],
        }
    );

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
