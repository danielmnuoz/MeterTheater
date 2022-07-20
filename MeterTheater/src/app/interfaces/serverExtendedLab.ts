import { ServerExtendedTable } from "./serverExtendedTable";

export interface ServerExtendedLab{
    labId?: number;
    labName?: string;
    tables?: ServerExtendedTable[];
}
