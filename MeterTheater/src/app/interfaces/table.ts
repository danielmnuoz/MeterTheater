import { Socket } from "./socket";

export interface Table{
    tableNumber?: number;
    sockets?: Socket[][];
}