import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { ServerMeter } from './serverMeter';
import { ServerSocket } from './serverSocket';
import { ServerUser } from './serverUser';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  // TODO: invalids - ie bad user id
  createDb(reqInfo?: RequestInfo | undefined): {} | Observable<{}> | Promise<{}> {
    // const meter: ServerMeter[] = [
    //   {meterID: 1, meterLanID: '12345678', meterSerialNumber: 111111111, meterUserID: 1},
    //   {meterID: 2, meterLanID: '22345678', meterSerialNumber: 222222222, meterUserID: 1},
    //   {meterID: 3, meterLanID: '32345678', meterSerialNumber: 333333333, meterUserID: 1},
    //   {meterID: 4, meterLanID: '42345678', meterSerialNumber: 444444444, meterUserID: 2},
    //   {meterID: 5, meterLanID: '52345678', meterSerialNumber: 555555555, meterUserID: 3}
    // ];
    // const socket: ServerSocket[] = [
    //   {socketID: 1, socketMeterID: 1, socketVoltage: 120, socketForm: '2S', socketLab: 2, socketRow: 1, socketCol: 1, socketUserID: 1, socketDate: "6/2/2022"},
    //   {socketID: 2, socketMeterID: 2, socketVoltage: 120, socketForm: '2S', socketLab: 2, socketRow: 1, socketCol: 1, socketUserID: 1, socketDate: "6/2/2022"},
    //   {socketID: 3, socketMeterID: 3, socketVoltage: 120, socketForm: '2S', socketLab: 2, socketRow: 1, socketCol: 1, socketUserID: 1, socketDate: "6/2/2022"},
    //   {socketID: 4, socketMeterID: 4, socketVoltage: 120, socketForm: '2S', socketLab: 6, socketRow: 1, socketCol: 1, socketUserID: 2, socketDate: "6/2/2022"},
    //   {socketID: 5, socketMeterID: 5, socketVoltage: 120, socketForm: '2S', socketLab: 6, socketRow: 1, socketCol: 1, socketUserID: 3, socketDate: "6/2/2022"}
    // ];
    // const user: ServerUser[] = [
    //   {userID: 1, userName: 'name1'},
    //   {userID: 2, userName: 'name2'},
    //   {userID: 3, userName: 'name3'}
    // ];
    return {};
  }

  // genSocketId(sockets: Socket[]): number {
  //   return sockets.length > 0 ? Math.max(...sockets.map(socket => socket.id)) + 1 : 1;
  // }
  // genMeterId(meters: Meter[]): number {
  //   return meters.length > 0 ? Math.max(...meters.map(meter => meter.id)) + 1 : 1;
  // }
  // genUserId(users: User[]): number {
  //   return users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
  // }

}
