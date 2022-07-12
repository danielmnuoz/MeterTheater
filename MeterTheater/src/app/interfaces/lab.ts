import { Table } from "./table";

export interface Lab{
    id?: number;
    // assumes name is unique
    name?: string;
    floor?: number;
    number?: number;
    tables?: Table[];
}