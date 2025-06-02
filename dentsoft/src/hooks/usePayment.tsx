import { useFrappeGetDocList } from 'frappe-react-sdk';

export const getPaymentList = (searchTerm?: string, patient?: string, date?: string) => {
    const filters: any[] = [];
    if (searchTerm) {
        filters.push(
            ["remarks", "like", `%${searchTerm}%`]
        );
    }
    if (patient) {
        filters.push(["party", "=", patient]);
    }
    if (date) {
        filters.push(["posting_date", "Between", [date, date]]);
    }
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Payment Entry',
        {
            fields: ['*'],
            filters
        }
    );
    return { data, isLoading, error, mutate };
};

export const getPendingPaymentList = (patient?: string, date?: string) => {
    const filters: any[] = [];
    if (patient) {
        filters.push(["customer", "=", patient]);
    }
    if (date) {
        filters.push(["posting_date", "Between", [date, date]]);
    }
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Sales Invoice',
        {
            fields: ['*'],
            filters
        }
    );
    return { data, isLoading, error, mutate };
};
