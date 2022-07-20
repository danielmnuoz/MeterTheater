import { Socket } from "./socket";

export interface ExtendedLocation{
    id?: number;
    tableId?: number;
    row?: number;
    col?: number;
    sockets?: Socket[];
}
