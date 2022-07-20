import { ExtendedLocation } from "./extendedLocation";

export interface ExtendedTable{
  id?: number;
  name?: string;
  labId?: number;
  locations?: ExtendedLocation[];
}
