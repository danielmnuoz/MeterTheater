import { ServerExtendedLocation } from "./serverExtendedLocation";

export interface ServerExtendedLab{
    labId?: number;
    labName?: number;
    labFloor?: number;
    labNumber?: number;
    locations?: ServerExtendedLocation[];
}