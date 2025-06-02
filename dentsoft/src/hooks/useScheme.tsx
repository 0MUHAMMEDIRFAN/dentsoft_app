import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getSchemeList = (searchTerm?: string, active?: boolean, patient?: string) => {
    const filters: any[] = [];
    if (searchTerm) {
        filters.push(
            ["name", "like", `%${searchTerm}%`],
            ["payment_term_name", "like", `%${searchTerm}%`]
        );
    }
    if (patient) {
        filters.push(["patient", "=", patient]);
    }
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Payment Term',
        {
            fields: ['*'],
            filters
        }
    );
    return { data, isLoading, error, mutate };
};
