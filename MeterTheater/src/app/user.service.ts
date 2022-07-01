import { Injectable } from '@angular/core';
import { User } from './user'
import { ServerUser } from './serverUser';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  private APIURL = 'http://10.1.210.32/api/';
  private userUrl = 'Users';

  DEFAULTID=-1;
  DEFAULTNAME='';

  defaultUser: User = {
    id: this.DEFAULTID,
    name: this.DEFAULTNAME,
    meterIDs: [],
    socketIDs: []
  }
  
  loginUser: User = this.defaultUser;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  loginCheck(): boolean{
    if(this.loginUser.id == this.defaultUser.id){
      return false;
    }else{
      return true;
    }
  }

  resetLoginUser(): void {
    this.loginUser.id = this.DEFAULTID;
    this.loginUser.name = this.DEFAULTNAME;
    this.loginUser.meterIDs = [];
    this.loginUser.socketIDs = [];    
  }

  serverUsers2Users(serverUsers: ServerUser[]): User[]{
    var users: User[]=[];
    for (var serverUser of serverUsers){
      users.push(this.serverUser2User(serverUser))
    }
    return users;
  }

  serverUser2User(serverUser: ServerUser): User {
    return {
      id: serverUser.userID,
      name: serverUser.userName
    } as User;
  }

  user2ServerUser(user:User): ServerUser {
    return {
      userID: user.id,
      userName: user.name
    } as ServerUser;
  }

  /** GET user by id. Will 404 if id not found */
  getUserByID(id: number): Observable<User> {
    const url = `${this.APIURL+this.userUrl}/${id}`;
    return this.http.get<ServerUser>(url).pipe(
      map(serverUser => this.serverUser2User(serverUser)),
      catchError(this.handleError<User>(`getUserByID id=${id}`))
    );
  }

  /* GET sockets whose name contains search term */
  searchUserByName(name: string): Observable<User[]> {
    return this.http.get<ServerUser[]>(`${this.APIURL+this.userUrl}/?userName=${name}`).pipe(
      map(serverUsers=> this.serverUsers2Users(serverUsers)),
      catchError(this.handleError<User[]>('searchUserByName', []))
    );
  }

  /** GET users from the server */
  getUsers(): Observable<User[]> {
    return this.http.get<ServerUser[]>(this.APIURL+this.userUrl)
      .pipe(
        map(serverUsers=>this.serverUsers2Users(serverUsers)),
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  /** PUT: update the user on the server */
  updateUser(user: User): Observable<any> {
    return this.http.put(this.APIURL+this.userUrl, this.user2ServerUser(user), this.httpOptions).pipe(
      tap(),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /** POST: add a new user to the server */
  addUser(user: User): Observable<User> {
    return this.http.post<ServerUser>(this.APIURL+this.userUrl, this.user2ServerUser(user), this.httpOptions).pipe(
      map(serverUser=>this.serverUser2User(serverUser)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the user from the server */
  deleteUser(id: number): Observable<User> {
    const url = `${this.APIURL+this.userUrl}/${id}`;
    return this.http.delete<ServerUser>(url, this.httpOptions).pipe(
      map(serverUser=>this.serverUser2User(serverUser)),
      catchError(this.handleError<User>('deleteUser'))
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