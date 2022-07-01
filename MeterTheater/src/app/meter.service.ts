import { Injectable } from '@angular/core';
import { Meter } from './meter'
import { ServerMeter } from './serverMeter';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MeterService {

  constructor(
    private http: HttpClient
  ) { }

  private APIURL = 'http://10.1.210.32/api/';
  private meterUrl = 'Meters';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  serverMeters2Meters(serverMeters: ServerMeter[]): Meter[]{
    var meters: Meter[]=[];
    for (var serverMeter of serverMeters){
      meters.push(this.serverMeter2Meter(serverMeter))
    }
    return meters;
  }

  serverMeter2Meter(serverMeter: ServerMeter): Meter{
    return {
      id: serverMeter.meterID,
      userID: serverMeter.meterUserID,
      lanID: serverMeter.meterLanID,
      serialNumber: serverMeter.meterSerialNumber
    } as Meter
  }

  meter2ServerMeter(meter: Meter): ServerMeter{
    return {
      meterID: meter.id,
      meterLanID:meter.lanID,
      meterSerialNumber:meter.serialNumber,
      meterUserID:meter.userID
    } as ServerMeter
  }

  /** GET meter by id. Will 404 if id not found */
  getMeterByID(id: number): Observable<Meter> {
    const url = `${this.APIURL+this.meterUrl}/${id}`;
    return this.http.get<ServerMeter>(url).pipe(
      map(serverMeter=>this.serverMeter2Meter(serverMeter)),
      catchError(this.handleError<Meter>(`getMeterByID id=${id}`))
    );
  }

  /** GET meters from the server */
  getMeters(): Observable<Meter[]> {
    return this.http.get<ServerMeter[]>(this.APIURL+this.meterUrl)
      .pipe(
        map(serverMeters=>this.serverMeters2Meters(serverMeters)),
        catchError(this.handleError<Meter[]>('getMeters', []))
      );
  }

  /** PUT: update the meter on the server */
  updateMeter(meter: Meter): Observable<any> {
    return this.http.put(this.APIURL+this.meterUrl, this.meter2ServerMeter(meter), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateMeter'))
    );
  }

  /** POST: add a new meter to the server */
  addMeter(meter: Meter): Observable<Meter> {
    return this.http.post<ServerMeter>(this.APIURL+this.meterUrl, this.meter2ServerMeter(meter), this.httpOptions).pipe(
      map(serverMeter=>this.serverMeter2Meter(serverMeter)),
      catchError(this.handleError<Meter>('addMeter'))
    );
  }

  /** DELETE: delete the meter from the server */
  deleteMeter(id: number): Observable<Meter> {
    const url = `${this.APIURL+this.meterUrl}/${id}`;

    return this.http.delete<ServerMeter>(url, this.httpOptions).pipe(
      map(serverMeter=>this.serverMeter2Meter(serverMeter)),
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
