import { useFrappeGetDocList, useFrappeCreateDoc, useFrappeUpdateDoc, useFrappeDeleteDoc, useFrappeGetDocCount } from 'frappe-react-sdk'
import { useCallback } from 'react'
import type { Treatment, TreatmentForm } from '../types/types.d'

export const getTreatmentList = (searchTerm?: string, active?: boolean) => {
    const filters: any[] = []

    if (searchTerm) {
        filters.push(
            ["template", "like", `%${searchTerm}%`],
            ["item_code", "like", `%${searchTerm}%`]
        )
    }

    if (active !== undefined) {
        filters.push(["disabled", "=", active ? 0 : 1])
    }
    const { data: totalCount } = useFrappeGetDocCount('Clinical Procedure Template', { filters })
    const { data, error, isLoading, mutate } = useFrappeGetDocList(
        'Clinical Procedure Template',
        {
            fields: ['name', 'item_code', 'template', 'description', 'item_group', 'rate', 'disabled', 'creation', 'modified', 'is_billable'],
            filters,
            orderBy: {
                field: 'creation',
                order: 'desc'
            }
        }
    )

    return {
        data: data as Treatment[],
        isLoading,
        error,
        mutate
    }
}

export const useTreatmentOperations = () => {
    const { createDoc, loading: createLoading } = useFrappeCreateDoc()
    const { updateDoc, loading: updateLoading } = useFrappeUpdateDoc()
    const { deleteDoc, loading: deleteLoading } = useFrappeDeleteDoc()

    const addTreatment = useCallback(async (formData: TreatmentForm) => {
        const payload = {
            ...formData,
            rate: Number(formData.rate)
        }

        const result = await createDoc('Clinical Procedure Template', payload)
        return result
    }, [createDoc])

    const editTreatment = useCallback(async (id: string, formData: TreatmentForm) => {
        const payload = {
            ...formData,
            rate: Number(formData.rate)
        }

        const result = await updateDoc('Clinical Procedure Template', id, payload)
        return result
    }, [updateDoc])

    const removeTreatment = useCallback(async (id: string) => {
        const result = await deleteDoc('Clinical Procedure Template', id)
        return result
    }, [deleteDoc])

    return {
        addTreatment,
        editTreatment,
        removeTreatment,
        loading: {
            create: createLoading,
            update: updateLoading,
            delete: deleteLoading
        }
    }
}
