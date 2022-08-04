export interface User{
    id?: number;
    // assumes name is unique
    name?: string;
    fullName?: string;
    isAdmin?: boolean;
    email?: string;
}
