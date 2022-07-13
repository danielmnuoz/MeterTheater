import { Injectable } from '@angular/core';
import { User } from './interfaces/user'
import { Socket } from './interfaces/socket';
import { Meter } from './interfaces/meter';
import { ServerUser } from './interfaces/serverUser';
import { ServerSocket } from './interfaces/serverSocket';
import { ServerMeter } from './interfaces/serverMeter';
import { ServerLocation } from './interfaces/serverLocation';
import { ServerLab } from './interfaces/serverLab';
import { ServerLog } from './interfaces/serverLog';
import { Log } from './interfaces/log';
import { ServerExtendedLab } from './interfaces/serverExtendedLab';
import { ServerExtendedLocation } from './interfaces/serverExtendedLocation';
import { ExtendedLab } from './interfaces/extendedLab';
import { ExtendedLocation } from './interfaces/extendedLocation';
import { Lab } from './interfaces/lab';
import { Table } from './interfaces/table';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MeterTheaterDBService {

  constructor(private http: HttpClient) { }

  private APIURL = 'http://10.1.210.32:8001/api/';
  private USERURL = 'Users';
  private SOCKETURL = 'Sockets';
  private METERURL = 'Meters';
  private LABURL = 'Labs';
  private LOGURL = 'Logs';
  private LOCATIONURL = 'Locations';

  DEFAULT_USER: User = {
    id: undefined,
    name: undefined
  }

  loginUser: User = this.DEFAULT_USER;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  loginCheck(): boolean {
    if (this.loginUser.id == this.DEFAULT_USER.id) {
      return false;
    } else {
      return true;
    }
  }

  resetLoginUser(): void {
    this.loginUser = this.DEFAULT_USER
  }

  // serverLabs2Labs(serverLabs: ServerLab[]): Lab[] {
  //   var labs: Lab[] = [];
  //   for (var serverLab of serverLabs) {
  //     labs.push(this.serverLab2Lab(serverLab))
  //   }
  //   return labs;
  // }

  // serverLab2Lab(serverLab: ServerLab): Lab {
  //   return {
  //     id: serverLab.labId,
  //     floor: serverLab.labFloor,
  //     name: serverLab.labName,
  //     number: serverLab.labNumber,
  //   } as Lab;
  // }

  // lab2ServerLab(log: Lab): ServerLab {
  //   return {
  //     labId: log.id,
  //     labNumber: log.number,
  //     labName: log.name,
  //     labFloor: log.floor
  //   } as ServerLab;
  // }

  extendedLabs2Labs(extendedLabs: ExtendedLab []): Lab[]{
    var labs: Lab[] = [];
    for (var extendedLab of extendedLabs) {
      labs.push(this.extendedLab2Lab(extendedLab))
    }
    return labs;
  }

  extendedLab2Lab(extendedLab: ExtendedLab): Lab {
    var ret: Lab = {
      id: extendedLab.id,
      name: extendedLab.name,
      floor: extendedLab.floor,
      number: extendedLab.number
    };
    var tables: Table[] = [];
    if (extendedLab.locations == undefined) {
      return ret;
    }
    var locs = extendedLab.locations.sort((a, b) => {
      if (a.tableNumber && b.tableNumber && a.tableNumber > b.tableNumber) {
        return 1;
      }
      if (a.tableNumber && b.tableNumber && a.tableNumber < b.tableNumber) {
        return -1;
      }
      if (a.row && b.row && a.row > b.row) {
        return 1
      } else if (a.row && b.row && a.row < b.row) {
        return -1
      } else if (a.row && b.row && a.row == b.row && a.col && b.col && a.col > b.col) {
        return 1
      } else if (a.row && b.row && a.row == b.row && a.col && b.col && a.col < b.col) {
        return -1
      }
      return 0
    });
    var row: Socket[] = [];
    var table: Table = {} as Table;
    for (var loc of locs) {
      if (loc.tableNumber == undefined) {
        continue;
      }
      if (table.tableNumber == undefined) {
        table = {
          tableNumber: loc.tableNumber,
          sockets: []
        };
      }
      if (loc.col == 1 && row.length != 0) {
        // Always has sockets
        if (table.sockets) {
          table.sockets.push(row);
          row = [];
        }
      }
      if (table.tableNumber != loc.tableNumber) {
        tables.push(table);
        table.sockets = [];
        table.tableNumber = loc.tableNumber
      }
      if (loc.sockets) {
        for (var socket of loc.sockets) {
          row.push(socket);
        }
      }
    }
    table.sockets?.push(row);
    tables.push(table);
    ret.tables = tables;
    return ret;
  }

  serverLogs2Logs(serverLogs: ServerLog[]): Log[] {
    var logs: Log[] = [];
    for (var serverLog of serverLogs) {
      logs.push(this.serverLog2Log(serverLog))
    }
    return logs;
  }

  serverLog2Log(serverLog: ServerLog): Log {
    return {
      id: serverLog.logId,
      userId: serverLog.logUserId,
      time: serverLog.logTime,
      socketId: serverLog.logSocketId,
      meterId: serverLog.logMeterId,
      description: serverLog.logDescription
    } as Log;
  }

  log2ServerLog(log: Log): ServerLog {
    return {
      logId: log.id,
      logDescription: log.description,
      logMeterId: log.meterId,
      logSocketId: log.socketId,
      logTime: log.time,
      logUserId: log.userId
    } as ServerLog;
  }

  // serverLocations2Locations(serverLocations: ServerLocation[]): Location[] {
  //   var locations: Location[] = [];
  //   for (var serverLocation of serverLocations) {
  //     locations.push(this.serverLocation2Location(serverLocation))
  //   }
  //   return locations;
  // }

  // serverLocation2Location(serverLocation: ServerLocation): Location {
  //   return {
  //     id: serverLocation.locationId,
  //     labId: serverLocation.locationLabId,
  //     row: serverLocation.locationRow,
  //     col: serverLocation.locationCol,
  //     tableNumber: serverLocation.locationTableNumber
  //   } as Location;
  // }

  // location2ServerLocation(location: Location): ServerLocation {
  //   return {
  //     locationId: location.id,
  //     locationCol: location.col,
  //     locationLabId: location.labId,
  //     locationRow: location.row,
  //     locationTableNumber: location.tableNumber
  //   } as ServerLocation;
  // }

  serverUsers2Users(serverUsers: ServerUser[]): User[] {
    var users: User[] = [];
    for (var serverUser of serverUsers) {
      users.push(this.serverUser2User(serverUser))
    }
    return users;
  }

  serverUser2User(serverUser: ServerUser): User {
    return {
      id: serverUser.userId,
      name: serverUser.userName
    } as User;
  }

  user2ServerUser(user: User): ServerUser {
    return {
      userId: user.id,
      userName: user.name
    } as ServerUser;
  }

  serverSockets2Sockets(serverSockets: ServerSocket[]): Socket[] {
    var sockets: Socket[] = [];
    for (var serverSocket of serverSockets) {
      sockets.push(this.serverSocket2Socket(serverSocket))
    }
    return sockets;
  }

  serverSocket2Socket(serverSocket: ServerSocket): Socket {
    return {
      id: serverSocket.socketId,
      meterId: serverSocket.socketMeterId,
      userId: serverSocket.socketUserId,
      form: serverSocket.socketForm,
      voltage: serverSocket.socketVoltage,
      locationId: serverSocket.socketLocationId
    } as Socket
  }

  socket2ServerSocket(socket: Socket): ServerSocket {
    return {
      socketId: socket.id,
      socketForm: socket.form,
      socketMeterId: socket.meterId,
      socketUserId: socket.userId,
      socketVoltage: socket.voltage,
      socketLocationId: socket.locationId
    } as ServerSocket
  }

  serverMeters2Meters(serverMeters: ServerMeter[]): Meter[] {
    var meters: Meter[] = [];
    for (var serverMeter of serverMeters) {
      meters.push(this.serverMeter2Meter(serverMeter))
    }
    return meters;
  }

  serverMeter2Meter(serverMeter: ServerMeter): Meter {
    return {
      id: serverMeter.meterId,
      userId: serverMeter.meterUserId,
      lanId: serverMeter.meterLanId,
      serialNumber: serverMeter.meterSerialNumber
    } as Meter
  }

  meter2ServerMeter(meter: Meter): ServerMeter {
    return {
      meterId: meter.id,
      meterLanId: meter.lanId,
      meterSerialNumber: meter.serialNumber,
      meterUserId: meter.userId
    } as ServerMeter
  }

  serverExtendedLocation2ExtendedLocation(serverExtendedLocation: ServerExtendedLocation): ExtendedLocation {
    return {
      id: serverExtendedLocation.locationId,
      tableNumber: serverExtendedLocation.locationTableNumber,
      row: serverExtendedLocation.locationRow,
      col: serverExtendedLocation.locationCol,
      labId: serverExtendedLocation.locationLabId,
      sockets: serverExtendedLocation.sockets ? this.serverSockets2Sockets(serverExtendedLocation.sockets) : undefined
    }
  }

  serverExtendedLocations2ExtendedLocations(serverExtendedLocations: ServerExtendedLocation[]): ExtendedLocation[] {
    var extendedLocations: ExtendedLocation[] = [];
    for (var serverExtendedLocation of serverExtendedLocations) {
      extendedLocations.push(this.serverExtendedLocation2ExtendedLocation(serverExtendedLocation));
    }
    return extendedLocations;
  }

  serverExtendedLab2ExtendedLab(serverExtendedLab: ServerExtendedLab): ExtendedLab {
    return {
      id: serverExtendedLab.labId,
      floor: serverExtendedLab.labFloor,
      number: serverExtendedLab.labNumber,
      name: serverExtendedLab.labName,
      locations: serverExtendedLab.locations ? this.serverExtendedLocations2ExtendedLocations(serverExtendedLab.locations) : undefined
    }
  }

  serverExtendedLabs2ExtendedLabs(serverExtendedLabs: ServerExtendedLab[]): ExtendedLab[] {
    var extendedLabs: ExtendedLab[] = [];
    for (var serverExtendedLab of serverExtendedLabs) {
      extendedLabs.push(this.serverExtendedLab2ExtendedLab(serverExtendedLab));
    }
    return extendedLabs;
  }

  /** GET labs from the server */
  getLabs(): Observable<Lab[]> {
    const url = `${this.APIURL + this.LABURL}/?extend=true`;
    return this.http.get<ServerExtendedLab[]>(url)
      .pipe(
        map(serverExtendedLabs => this.extendedLabs2Labs(this.serverExtendedLabs2ExtendedLabs(serverExtendedLabs))),
        catchError(this.handleError<Lab[]>('getLabs', []))
      );
  }

  // /** GET location by id. Will 404 if id not found */
  // getLocationById(id: number): Observable<Location> {
  //   const url = `${this.APIURL + this.LOCATIONURL}/${id}`;
  //   return this.http.get<ServerLocation>(url).pipe(
  //     map(serverLocation => this.serverLocation2Location(serverLocation)),
  //     catchError(this.handleError<Location>(`getLocationById id=${id}`))
  //   );
  // }

  // /** GET location by id. Will 404 if id not found */
  // getLabById(id: number): Observable<Lab> {
  //   const url = `${this.APIURL + this.LABURL}/${id}`;
  //   return this.http.get<ServerLab>(url).pipe(
  //     map(serverLab => this.serverLab2Lab(serverLab)),
  //     catchError(this.handleError<Lab>(`getLabById id=${id}`))
  //   );
  // }

  /** GET logs from the server */
  getLogs(): Observable<Log[]> {
    return this.http.get<ServerLog[]>(this.APIURL + this.LOGURL)
      .pipe(
        map(serverLogs => this.serverLogs2Logs(serverLogs)),
        catchError(this.handleError<Log[]>('getLogs', []))
      );
  }

  /** GET matching last log from the server */
  getLastLog(userId: number | undefined = undefined, socketId: number | undefined = undefined, meterId: number | undefined = undefined): Observable<Log> {
    return this.http.get<ServerLog>(this.APIURL + this.LOGURL+`/last/?logUserId=${userId}&logSocketId=${socketId}&logMeterId=${meterId}`)
      .pipe(
        map(serverLog => this.serverLog2Log(serverLog)),
        catchError(this.handleError<Log>('getLastLog'))
      );
  }

  /** POST: add a new log to the server */
  // Server sets the time
  addLog(log: Log): Observable<Log> {
    return this.http.post<ServerLog>(this.APIURL + this.LOGURL, this.log2ServerLog(log), this.httpOptions).pipe(
      map(serverLog => this.serverLog2Log(serverLog)),
      catchError(this.handleError<Log>('addLog'))
    );
  }

  /** GET user by id. Will 404 if id not found */
  getUserById(id: number): Observable<User> {
    const url = `${this.APIURL + this.USERURL}/${id}`;
    return this.http.get<ServerUser>(url).pipe(
      map(serverUser => this.serverUser2User(serverUser)),
      catchError(this.handleError<User>(`getUserById id=${id}`))
    );
  }

  /* GET sockets whose name contains search term */
  searchUserByName(name: string): Observable<User[]> {
    return this.http.get<ServerUser[]>(`${this.APIURL + this.USERURL}/?userName=${name}`).pipe(
      map(serverUsers => this.serverUsers2Users(serverUsers)),
      catchError(this.handleError<User[]>('searchUserByName', []))
    );
  }

  /** GET users from the server */
  getUsers(): Observable<User[]> {
    return this.http.get<ServerUser[]>(this.APIURL + this.USERURL)
      .pipe(
        map(serverUsers => this.serverUsers2Users(serverUsers)),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  /** PUT: update the user on the server */
  updateUser(user: User): Observable<any> {
    var id = user.id;
    const url = `${this.APIURL + this.USERURL}/${id}`;
    return this.http.put(url, this.user2ServerUser(user), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /** POST: add a new user to the server */
  addUser(user: User): Observable<User> {
    return this.http.post<ServerUser>(this.APIURL + this.USERURL, this.user2ServerUser(user), this.httpOptions).pipe(
      map(serverUser => this.serverUser2User(serverUser)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the user from the server */
  deleteUser(id: number): Observable<User> {
    const url = `${this.APIURL + this.USERURL}/${id}`;
    return this.http.delete<ServerUser>(url, this.httpOptions).pipe(
      map(serverUser => this.serverUser2User(serverUser)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** GET socket by id. Will 404 if id not found */
  getSocketById(id: number): Observable<Socket> {
    const url = `${this.APIURL + this.SOCKETURL}/${id}`;
    return this.http.get<ServerSocket>(url).pipe(
      map(serverSocket => this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>(`getSocketById id=${id}`))
    );
  }

  /* GET sockets whose name contains search term */
  searchSocketsByUser(userId: number): Observable<Socket[]> {
    return this.http.get<ServerSocket[]>(`${this.APIURL + this.SOCKETURL}/?socketUserId=${userId}`).pipe(
      map(serverSockets => this.serverSockets2Sockets(serverSockets)),
      catchError(this.handleError<Socket[]>('searchSockets', []))
    );
  }

  /** GET sockets from the server */
  getSockets(): Observable<Socket[]> {
    return this.http.get<ServerSocket[]>(this.APIURL + this.SOCKETURL)
      .pipe(
        map(serverSockets => this.serverSockets2Sockets(serverSockets)),
        catchError(this.handleError<Socket[]>('getSockets', []))
      );
  }

  /** PUT: update the socket on the server */
  updateSocket(socket: Socket): Observable<any> {
    var id = socket.id;
    const url = `${this.APIURL + this.SOCKETURL}/${id}`;
    return this.http.put(url, this.socket2ServerSocket(socket), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateSocket'))
    );
  }

  /** POST: add a new socket to the server */
  addSocket(socket: Socket): Observable<Socket> {
    return this.http.post<ServerSocket>(this.APIURL + this.SOCKETURL, this.socket2ServerSocket(socket), this.httpOptions).pipe(
      map(serverSocket => this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>('addSocket'))
    );
  }

  /** DELETE: delete the socket from the server */
  deleteSocket(id: number): Observable<Socket> {
    const url = `${this.APIURL + this.SOCKETURL}/${id}`;
    return this.http.delete<ServerSocket>(url, this.httpOptions).pipe(
      map(serverSocket => this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>('deleteSocket'))
    );
  }

  /* GET meters whose name contains search term */
  searchMetersByUser(userId: number): Observable<Meter[]> {
    return this.http.get<ServerMeter[]>(`${this.APIURL + this.METERURL}/?meterUserId=${userId}`).pipe(
      map(serverMeters => this.serverMeters2Meters(serverMeters)),
      catchError(this.handleError<Meter[]>('searchMeters', []))
    );
  }

  /** GET meter by id. Will 404 if id not found */
  getMeterById(id: number): Observable<Meter> {
    const url = `${this.APIURL + this.METERURL}/${id}`;
    return this.http.get<ServerMeter>(url).pipe(
      map(serverMeter => this.serverMeter2Meter(serverMeter)),
      catchError(this.handleError<Meter>(`getMeterById id=${id}`))
    );
  }

  /** GET meters from the server */
  getMeters(): Observable<Meter[]> {
    return this.http.get<ServerMeter[]>(this.APIURL + this.METERURL)
      .pipe(
        map(serverMeters => this.serverMeters2Meters(serverMeters)),
        catchError(this.handleError<Meter[]>('getMeters', []))
      );
  }

  /** PUT: update the meter on the server */
  updateMeter(meter: Meter): Observable<any> {
    var id = meter.id;
    const url = `${this.APIURL + this.METERURL}/${id}`;
    return this.http.put(url, this.meter2ServerMeter(meter), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateMeter'))
    );
  }

  /** POST: add a new meter to the server */
  addMeter(meter: Meter): Observable<Meter> {
    return this.http.post<ServerMeter>(this.APIURL + this.METERURL, this.meter2ServerMeter(meter), this.httpOptions).pipe(
      map(serverMeter => this.serverMeter2Meter(serverMeter)),
      catchError(this.handleError<Meter>('addMeter'))
    );
  }

  /** DELETE: delete the meter from the server */
  deleteMeter(id: number): Observable<Meter> {
    const url = `${this.APIURL + this.METERURL}/${id}`;
    return this.http.delete<ServerMeter>(url, this.httpOptions).pipe(
      map(serverMeter => this.serverMeter2Meter(serverMeter)),
      catchError(this.handleError<Meter>('deleteMeter'))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
