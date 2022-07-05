import { Injectable } from '@angular/core';
import { User } from './user'
import { Socket } from './socket';
import { Meter } from './meter';
import { Location } from './location';
import { ServerUser } from './serverUser';
import { ServerSocket } from './serverSocket';
import { ServerMeter } from './serverMeter';
import { ServerLocation } from './serverLocation';
import { ServerLab } from './serverLab';
import { ServerLog } from './serverLog';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MeterTheaterDBService {

  constructor(private http: HttpClient) { }

  private APIURL = 'http://10.1.210.32/api/';
  private userUrl = 'Users';
  private socketUrl = 'Sockets';
  private meterUrl = 'Meters';
  private labUrl = 'Labs';
  private logUrl = 'Logs';
  private locationUrl = 'Locations';

  DEFAULTID = -1;
  DEFAULTNAME = '';

  DEFAULT_USER: User = {
    id: this.DEFAULTID,
    name: this.DEFAULTNAME
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

  /** GET user by id. Will 404 if id not found */
  getUserByID(id: number): Observable<User> {
    const url = `${this.APIURL + this.userUrl}/${id}`;
    return this.http.get<ServerUser>(url).pipe(
      map(serverUser => this.serverUser2User(serverUser)),
      catchError(this.handleError<User>(`getUserByID id=${id}`))
    );
  }

  /* GET sockets whose name contains search term */
  searchUserByName(name: string): Observable<User[]> {
    return this.http.get<ServerUser[]>(`${this.APIURL + this.userUrl}/?userName=${name}`).pipe(
      map(serverUsers => this.serverUsers2Users(serverUsers)),
      catchError(this.handleError<User[]>('searchUserByName', []))
    );
  }

  /** GET users from the server */
  getUsers(): Observable<User[]> {
    return this.http.get<ServerUser[]>(this.APIURL + this.userUrl)
      .pipe(
        map(serverUsers => this.serverUsers2Users(serverUsers)),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  /** PUT: update the user on the server */
  updateUser(user: User): Observable<any> {
    return this.http.put(this.APIURL + this.userUrl, this.user2ServerUser(user), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /** POST: add a new user to the server */
  addUser(user: User): Observable<User> {
    return this.http.post<ServerUser>(this.APIURL + this.userUrl, this.user2ServerUser(user), this.httpOptions).pipe(
      map(serverUser => this.serverUser2User(serverUser)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the user from the server */
  deleteUser(id: number): Observable<User> {
    const url = `${this.APIURL + this.userUrl}/${id}`;
    return this.http.delete<ServerUser>(url, this.httpOptions).pipe(
      map(serverUser => this.serverUser2User(serverUser)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** GET socket by id. Will 404 if id not found */
  getSocketByID(id: number): Observable<Socket> {
    const url = `${this.APIURL + this.socketUrl}/${id}`;
    return this.http.get<ServerSocket>(url).pipe(
      map(serverSocket => this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>(`getSocketByID id=${id}`))
    );
  }

  /* GET sockets whose name contains search term */
  searchSocketsByUser(userID: number): Observable<Socket[]> {
    return this.http.get<ServerSocket[]>(`${this.APIURL + this.socketUrl}/?socketUserID=${userID}`).pipe(
      map(serverSockets => this.serverSockets2Sockets(serverSockets)),
      catchError(this.handleError<Socket[]>('searchSockets', []))
    );
  }

  /** GET sockets from the server */
  getSockets(): Observable<Socket[]> {
    return this.http.get<ServerSocket[]>(this.APIURL + this.socketUrl)
      .pipe(
        map(serverSockets => this.serverSockets2Sockets(serverSockets)),
        catchError(this.handleError<Socket[]>('getSockets', []))
      );
  }

  /** PUT: update the socket on the server */
  updateSocket(socket: Socket): Observable<any> {
    return this.http.put(this.APIURL + this.socketUrl, this.socket2ServerSocket(socket), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateSocket'))
    );
  }

  /** POST: add a new socket to the server */
  addSocket(socket: Socket): Observable<Socket> {
    return this.http.post<ServerSocket>(this.APIURL + this.socketUrl, this.socket2ServerSocket(socket), this.httpOptions).pipe(
      map(serverSocket => this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>('addSocket'))
    );
  }

  /** DELETE: delete the socket from the server */
  deleteSocket(id: number): Observable<Socket> {
    const url = `${this.APIURL + this.socketUrl}/${id}`;

    return this.http.delete<ServerSocket>(url, this.httpOptions).pipe(
      map(serverSocket => this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>('deleteSocket'))
    );
  }

  /* GET meters whose name contains search term */
  searchMetersByUser(userID: number): Observable<Meter[]> {
    return this.http.get<ServerMeter[]>(`${this.APIURL + this.meterUrl}/?meterUserID=${userID}`).pipe(
      map(serverMeters => this.serverMeters2Meters(serverMeters)),
      catchError(this.handleError<Meter[]>('searchMeters', []))
    );
  }

  /** GET meter by id. Will 404 if id not found */
  getMeterByID(id: number): Observable<Meter> {
    const url = `${this.APIURL + this.meterUrl}/${id}`;
    return this.http.get<ServerMeter>(url).pipe(
      map(serverMeter => this.serverMeter2Meter(serverMeter)),
      catchError(this.handleError<Meter>(`getMeterByID id=${id}`))
    );
  }

  /** GET meters from the server */
  getMeters(): Observable<Meter[]> {
    return this.http.get<ServerMeter[]>(this.APIURL + this.meterUrl)
      .pipe(
        map(serverMeters => this.serverMeters2Meters(serverMeters)),
        catchError(this.handleError<Meter[]>('getMeters', []))
      );
  }

  /** PUT: update the meter on the server */
  updateMeter(meter: Meter): Observable<any> {
    return this.http.put(this.APIURL + this.meterUrl, this.meter2ServerMeter(meter), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateMeter'))
    );
  }

  /** POST: add a new meter to the server */
  addMeter(meter: Meter): Observable<Meter> {
    return this.http.post<ServerMeter>(this.APIURL + this.meterUrl, this.meter2ServerMeter(meter), this.httpOptions).pipe(
      map(serverMeter => this.serverMeter2Meter(serverMeter)),
      catchError(this.handleError<Meter>('addMeter'))
    );
  }

  /** DELETE: delete the meter from the server */
  deleteMeter(id: number): Observable<Meter> {
    const url = `${this.APIURL + this.meterUrl}/${id}`;

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