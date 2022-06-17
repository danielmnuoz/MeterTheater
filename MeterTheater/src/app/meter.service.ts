import { Injectable } from '@angular/core';
import { Meter } from './meter'

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

  private metersUrl = 'api/meters';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** GET meter by id. Will 404 if id not found */
  getMeterByID(id: number): Observable<Meter> {
    const url = `${this.metersUrl}/${id}`;
    return this.http.get<Meter>(url).pipe(
      tap(),
      catchError(this.handleError<Meter>(`getMeterByID id=${id}`))
    );
  }

  /** GET meters from the server */
  getMeters(): Observable<Meter[]> {
    return this.http.get<Meter[]>(this.metersUrl)
      .pipe(
        tap(),
        catchError(this.handleError<Meter[]>('getMeters', []))
      );
  }

  /** PUT: update the meter on the server */
  updateMeter(meter: Meter): Observable<any> {
    return this.http.put(this.metersUrl, meter, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateMeter'))
    );
  }

  /** POST: add a new meter to the server */
  addMeter(meter: Meter): Observable<Meter> {
    return this.http.post<Meter>(this.metersUrl, meter, this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<Meter>('addMeter'))
    );
  }

  /** DELETE: delete the meter from the server */
  deleteMeter(id: number): Observable<Meter> {
    const url = `${this.metersUrl}/${id}`;

    return this.http.delete<Meter>(url, this.httpOptions).pipe(
      tap(),
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
