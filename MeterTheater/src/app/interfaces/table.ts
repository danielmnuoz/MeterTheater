import { Socket } from "./socket";

export interface Table{
  id?: number;
  name?: string;
  sockets?: Socket[][];
}
