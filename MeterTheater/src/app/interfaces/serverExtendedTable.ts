import { ServerExtendedLocation } from "./serverExtendedLocation";

export interface ServerExtendedTable{
  tableId?: number;
  tableName?: string;
  tableLabId?: number;
  locations?: ServerExtendedLocation[];
}
