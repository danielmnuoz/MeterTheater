import { ServerSocket } from "./serverSocket";

export interface ServerExtendedLocation{
    locationId?: number;
    locationLabId?: number;
    locationTableNumber?: number;
    locationRow?: number;
    locationCol?: number;
    sockets?: ServerSocket[];
}