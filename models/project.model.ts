export interface ProjectModel {
    settings: {
        reportsFrequency: string
    };
    currency: {
        name: string;
        code: string;
    }
    _id?: string;
    id?: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
