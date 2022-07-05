import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket';
import { User } from '../user';
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnChanges {

  constructor(
    private meterTheaterDBService: MeterTheaterDBService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectedSocketUser().subscribe(socketUser => this.socketUser = socketUser);
  }

  socketUser: User = this.meterTheaterDBService.DEFAULT_USER;

  @Input() socket?: Socket;
  @Input() meter?: Meter;
  @Output() onUpdateSocketUser = new EventEmitter<User>();

  updateSelectedSocketUser(): Observable<User> {
    if (this.socket && this.socket.userId) {
      return this.meterTheaterDBService.getUserByID(this.socket.userId);
    } else {
      return of(this.meterTheaterDBService.DEFAULT_USER);
    }
  }
  // TODO: wait for all to finish before profile? also before update theater?
  // updateSocketUser() {
  //   if (this.socket) {
  //     var oldUserID = this.socket.userID;
  //     var socketID = this.socket.id;
  //     this.socket.userID = this.meterTheaterDBService.loginUser.id;
  //     this.updateSelectedSocketUser().subscribe(socketUser => {
  //       this.socketUser = socketUser;
  //       if (this.socket) {
  //         this.meterTheaterDBService.updateSocket(this.socket).subscribe(_ => {
  //           this.meterTheaterDBService.loginUser.socketIDs.push(socketID);
  //           this.meterTheaterDBService.updateUser(this.userService.loginUser).subscribe(_ => {
  //             this.meterTheaterDBService.getUserByID(oldUserID).subscribe(oldUser => {
  //               var ind = oldUser.socketIDs.indexOf(socketID);
  //               if (ind > -1) {
  //                 oldUser.socketIDs.splice(ind, 1)
  //                 this.userService.updateUser(oldUser).subscribe(_ => {
  //                   this.onUpdateSocketUser.emit(this.socketUser);
  //                 });
  //               }
  //             });
  //           });
  //         })
  //       }
  //     });
  //   }
  // }
  updateSocketUser(){

  }
}
