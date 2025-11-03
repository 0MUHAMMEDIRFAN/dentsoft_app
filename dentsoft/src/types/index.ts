// Re-export all types from types.d.ts for easier imports
export * from './types.d'

// Additional common types that might be used across the application
export interface ApiResponse<T> {
    data: T
    message: string
    status: number
}

export interface PaginationMeta {
    page: number
    size: number
    total: number
    pages: number
}

export interface ListResponse<T> {
    data: T[]
    meta: PaginationMeta
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface ToastNotification {
    message: string
    type: NotificationType
    duration?: number
}
