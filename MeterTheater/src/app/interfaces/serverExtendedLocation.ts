import { ServerSocket } from "./serverSocket";

export interface ServerExtendedLocation{
    locationId?: number;
    locationTableId?: number;
    locationRow?: number;
    locationCol?: number;
    sockets?: ServerSocket[];
}
