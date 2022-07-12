import { ExtendedLocation } from "./extendedLocation";

export interface ExtendedLab{
    id?: number;
    name?: string;
    floor?: number;
    number?: number;
    locations?: ExtendedLocation[];
}