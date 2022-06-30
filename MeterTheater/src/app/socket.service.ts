import { Injectable } from '@angular/core';
import { Socket } from './socket'
import { ServerSocket } from './serverSocket';
import { Location } from './location';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private http: HttpClient
  ) { }

  private APIURL = 'http://10.1.210.32/api/';
  private socketUrl = 'Sockets';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  serverSockets2Sockets(serverSockets: ServerSocket[]): Socket[]{
    var sockets: Socket[]=[];
    for (var serverSocket of serverSockets){
      sockets.push(this.serverSocket2Socket(serverSocket))
    }
    return sockets;
  }

  serverSocket2Socket(serverSocket: ServerSocket): Socket{
    return {
      id: serverSocket.socketID,
      meterID: serverSocket.socketMeterID,
      userID: serverSocket.socketUserID,
      form: serverSocket.socketForm,
      location: {lab: serverSocket.socketLab, row: serverSocket.socketRow, col: serverSocket.socketCol},
      date: serverSocket.socketDate,
      voltage: serverSocket.socketVoltage
    } as Socket
  }

  socket2ServerSocket(socket: Socket): ServerSocket{
    return {
      socketID: socket.id,
      socketCol: socket.location.col,
      socketRow: socket.location.row,
      socketDate:socket.date,
      socketForm:socket.form,
      socketLab:socket.location.lab,
      socketMeterID:socket.meterID,
      socketUserID:socket.userID,
      socketVoltage:socket.voltage
    } as ServerSocket
  }

  /** GET socket by id. Will 404 if id not found */
  getSocketByID(id: number): Observable<Socket> {
    const url = `${this.APIURL+this.socketUrl}/${id}`;
    return this.http.get<ServerSocket>(url).pipe(
      map(serverSocket => this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>(`getSocketByID id=${id}`))
    );
  }

  /* GET sockets whose name contains search term */
  searchSocketsByUser(userID: number): Observable<Socket[]> {
    return this.http.get<ServerSocket[]>(`${this.APIURL+this.socketUrl}/?socketUserID=${userID}`).pipe(
      map(serverSockets=> this.serverSockets2Sockets(serverSockets)),
      catchError(this.handleError<Socket[]>('searchSockets', []))
    );
  }

  searchSocketsByLab(lab: number): Observable<Socket[]> {
    return this.http.get<ServerSocket[]>(`${this.APIURL+this.socketUrl}/?socketLab=${lab}`).pipe(
      map(serverSockets=>this.serverSockets2Sockets(serverSockets)),
      catchError(this.handleError<Socket[]>('searchSockets', []))
    );
  }

  /** GET sockets from the server */
  getSockets(): Observable<Socket[]> {
    return this.http.get<ServerSocket[]>(this.APIURL+this.socketUrl)
      .pipe(
        map(serverSockets => this.serverSockets2Sockets(serverSockets)),
        catchError(this.handleError<Socket[]>('getSockets', []))
      );
  }

  /** PUT: update the socket on the server */
  updateSocket(socket: Socket): Observable<any> {
    return this.http.put(this.APIURL+this.socketUrl, this.socket2ServerSocket(socket), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateSocket'))
    );
  }

  /** POST: add a new socket to the server */
  addSocket(socket: Socket): Observable<Socket> {
    return this.http.post<ServerSocket>(this.APIURL+this.socketUrl, this.socket2ServerSocket(socket), this.httpOptions).pipe(
      map(serverSocket=>this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>('addSocket'))
    );
  }

  /** DELETE: delete the socket from the server */
  deleteSocket(id: number): Observable<Socket> {
    const url = `${this.APIURL+this.socketUrl}/${id}`;

    return this.http.delete<ServerSocket>(url, this.httpOptions).pipe(
      map(serverSocket=>this.serverSocket2Socket(serverSocket)),
      catchError(this.handleError<Socket>('deleteSocket'))
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
