import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { Socket } from './socket';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb(reqInfo?: RequestInfo | undefined): {} | Observable<{}> | Promise<{}> {
    const sockets: Socket[] = [
      {id: 1, owner: 'tstName1', meter: {id: 1, lanID: '12345678', owner: 'tstName6'}, voltage: 120, form: '2S', location: 1, floor: 2},
      {id: 2, owner: 'tstName2', meter: {id: 2, lanID: '22345678', owner: 'tstName7'}, voltage: 120, form: '2S', location: 2, floor: 2},
      {id: 3, owner: 'tstName3', meter: {id: 3, lanID: '32345678', owner: 'tstName8'}, voltage: 120, form: '2S', location: 1, floor: 6},
      {id: 4, owner: 'tstName4', meter: {id: 4, lanID: '42345678', owner: 'tstName9'}, voltage: 120, form: '2S', location: 2, floor: 6},
      {id: 5, owner: 'tstName5', meter: {id: 5, lanID: '52345678', owner: 'tstName0'}, voltage: 120, form: '2S', location: 3, floor: 2}
    ];
    return {sockets};
  }

  genId(sockets: Socket[]): number {
    return sockets.length > 0 ? Math.max(...sockets.map(socket => socket.id)) + 1 : 0;
  }

}
