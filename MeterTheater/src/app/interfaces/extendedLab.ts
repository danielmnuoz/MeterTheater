import { ExtendedLocation } from "./extendedLocation";

export interface ExtendedLab{
    id?: number;
    name?: number;
    floor?: number;
    number?: number;
    locations?: ExtendedLocation[];
}