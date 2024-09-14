export interface FetchingError extends Error {
    message: string;
    name: string;
    code?: string;
    status?: number;
}
