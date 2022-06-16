import { Injectable } from '@angular/core';
import { Socket } from './socket'
import { User } from './user'

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

  private socketsUrl = 'api/sockets';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  user: User = {
    id: 0,
    name: ''
  }

  /** GET socket by id. Will 404 if id not found */
  getSocketByID(id: number): Observable<Socket> {
    const url = `${this.socketsUrl}/${id}`;
    return this.http.get<Socket>(url).pipe(
      tap(),
      catchError(this.handleError<Socket>(`getSocketByID id=${id}`))
    );
  }

  /* GET sockets whose name contains search term */
  searchSockets(owner: string): Observable<Socket[]> {
    if (!owner.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Socket[]>(`${this.socketsUrl}/?owner=${owner}`).pipe(
      tap(),
      catchError(this.handleError<Socket[]>('searchSockets', []))
    );
  }

  /** GET sockets from the server */
  getSockets(): Observable<Socket[]> {
    return this.http.get<Socket[]>(this.socketsUrl)
      .pipe(
        tap(),
        catchError(this.handleError<Socket[]>('getSockets', []))
      );
  }

  /** PUT: update the socket on the server */
  updateSocket(socket: Socket): Observable<any> {
    return this.http.put(this.socketsUrl, socket, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateSocket'))
    );
  }

  /** POST: add a new socket to the server */
  addSocket(socket: Socket): Observable<Socket> {
    return this.http.post<Socket>(this.socketsUrl, socket, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<Socket>('addSocket'))
    );
  }

  /** DELETE: delete the socket from the server */
  deleteSocket(id: number): Observable<Socket> {
    const url = `${this.socketsUrl}/${id}`;

    return this.http.delete<Socket>(url, this.httpOptions).pipe(
      tap(),
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
