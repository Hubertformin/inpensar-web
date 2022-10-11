export interface CustomErrorInterface extends Error {
    // Function to set the status code of the error
    get statusCode(): number; // status code to send along with the error
    status: (this: CustomErrorInterface, code?: number) => CustomErrorInterface;
}

export function CustomError(message: string) {
    let _status = 500;
    const error = new Error(message) as CustomErrorInterface;
    (error as any).status = function(this: CustomErrorInterface, code: number) {
        _status = Number(code) || 500;
        return this;
    }
    Object.defineProperty(error, 'statusCode', { get: () => _status });

    return error;
}