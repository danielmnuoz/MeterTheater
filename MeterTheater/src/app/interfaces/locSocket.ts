import { Socket } from "./socket";

export interface LocSocket {
  socket?: Socket;
  row?: number;
  col?: number;
  labName?: string;
  tableName?: string;
  coord?: string;
}
