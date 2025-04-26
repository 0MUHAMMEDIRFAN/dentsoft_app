import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getPatientAppointmentList = (searchTerm: string | undefined, patient: string | undefined) => {
    const { data, error, isLoading } = useFrappeGetDocList(
        'Patient Appointment',
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

export const getPatientAppointmentTypeList = (searchTerm: string | undefined) => {
    const { data, error, isLoading } = useFrappeGetDocList(
        'Appointment Type',
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
