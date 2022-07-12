import { ServerExtendedLocation } from "./serverExtendedLocation";

export interface ServerExtendedLab{
    labId?: number;
    labName?: string;
    labFloor?: number;
    labNumber?: number;
    locations?: ServerExtendedLocation[];
}