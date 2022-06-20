import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket';
import { User } from '../user';
import { MeterService } from '../meter.service';
import { SocketService } from '../socket.service';
import { UserService } from '../user.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnChanges {

  constructor(
    private meterService: MeterService,
    private socketService: SocketService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectedSocketUser().subscribe(socketUser => this.socketUser = socketUser);
  }

  socketUser: User = this.userService.defaultUser;

  @Input() socket?: Socket;
  @Input() meter?: Meter;
  @Output() onUpdateSocketUser = new EventEmitter<User>();

  updateSelectedSocketUser(): Observable<User> {
    if (this.socket) {
      return this.userService.getUserByID(this.socket.userID);
    } else {
      return of(this.userService.defaultUser);
    }
  }
  // TODO: wait for all to finish before profile? also before update theater?
  updateSocketUser() {
    if (this.socket) {
      var oldUserID = this.socket.userID;
      var socketID = this.socket.id;
      this.socket.userID = this.userService.loginUser.id;
      this.updateSelectedSocketUser().subscribe(socketUser => {
        this.socketUser = socketUser;
        if (this.socket) {
          this.socketService.updateSocket(this.socket).subscribe(_ => {
            this.userService.loginUser.socketIDs.push(socketID);
            this.userService.updateUser(this.userService.loginUser).subscribe(_ => {
              this.userService.getUserByID(oldUserID).subscribe(oldUser => {
                var ind = oldUser.socketIDs.indexOf(socketID);
                if (ind > -1) {
                  oldUser.socketIDs.splice(ind, 1)
                  this.userService.updateUser(oldUser).subscribe(_ => {
                    this.onUpdateSocketUser.emit(this.socketUser);
                  });
                }
              });
            });
          })
        }
      });
    }
  }
}
