import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getPatientAppointmentList = (searchTerm?: string, patient?: string) => {
    const filters: any[] = [];
    if (searchTerm) {
        filters.push(
            ["name", "like", `%${searchTerm}%`],
            ["title", "like", `%${searchTerm}%`]
        );
    }
    if (patient) {
        filters.push(["patient", "=", patient]);
    }
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Patient Appointment',
        {
            fields: ['*'],
            filters
        }
    );

    return { data, isLoading, error, mutate };
};

export const getPatientAppointmentTypeList = (searchTerm?: string) => {
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Appointment Type',
        {
            fields: ['*'],
            // filters: [['patient', '=', patient || ""]],
        }
    );

    return { data, isLoading, error, mutate };

};
