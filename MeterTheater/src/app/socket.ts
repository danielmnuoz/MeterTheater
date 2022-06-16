import { Meter } from "./meter";

export interface Socket{
    id: number;
    owner: string;
    meter: Meter;
    voltage: number;
    form: string;
    floor: number;
    location: number;
}