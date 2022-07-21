import { LocSocket } from "./locSocket";

export interface Table{
  id?: number;
  name?: string;
  sockets?: (LocSocket | undefined)[][];
}
