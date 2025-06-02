import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getPatientTreatmentList = (searchTerm?: string, patient?: string) => {
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Clinical Procedure',
        {
            fields: ['*'],
            // filters: [['patient', '=', patient || ""]],
        }
    );

    return { data, isLoading, error, mutate };
};
