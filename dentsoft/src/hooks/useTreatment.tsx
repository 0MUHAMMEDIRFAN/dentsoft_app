import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getTreatmentList = (searchTerm?: string | undefined, active?: boolean, patient?: string | undefined) => {
    const filters: any[] = [];
    if (searchTerm) {
        filters.push(["template", "like", `%${searchTerm}%`], ["item_code", "like", `%${searchTerm}%`]);
    }
    if (active !== undefined) {
        filters.push(["disabled", "=", !active]);
    }
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Clinical Procedure Template',
        {
            fields: ['*'],
            filters
        }
    );
    return ({ data, isLoading, error, mutate });
};
