import { Location } from './location';

export interface Socket{
    id: number;
    userID: number;
    meterID: number;
    voltage: number;
    form: string;
    date: string;
    location: Location;
}