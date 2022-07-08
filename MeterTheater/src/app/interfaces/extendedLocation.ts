import { Socket } from "./socket";

export interface ExtendedLocation{
    id?: number;
    labId?: number;
    tableNumber?: number;
    row?: number;
    col?: number;
    sockets?: Socket[];
}