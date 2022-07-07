import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket';
import { User } from '../interfaces/user';
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { Observable, of } from 'rxjs';
import { ServerLog } from '../interfaces/serverLog';

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
    this.getUser().subscribe(socketUser => this.socketUser = socketUser);
  }

  socketUser: User = this.meterTheaterDBService.DEFAULT_USER;

  @Input() socket?: Socket;
  @Input() meter?: Meter;
  @Output() onUpdateSocketUser = new EventEmitter<User>();

  getUser(): Observable<User> {
    if (this.socket && this.socket.userId) {
      return this.meterTheaterDBService.getUserById(this.socket.userId);
    } else {
      // should never happen - case not handled
      return of(this.meterTheaterDBService.DEFAULT_USER);
    }
  }
  // TODO: wait for all to finish before profile? also before update theater?
  updateSocketUser() {
    if (this.socket) {
      if (!this.meterTheaterDBService.loginCheck()) {
        return;
      }
      this.socket.userId = this.meterTheaterDBService.loginUser.id;
      this.getUser().subscribe(socketUser => {
        this.socketUser = socketUser;
        if (this.socket) {
          this.meterTheaterDBService.updateSocket(this.socket).subscribe();
          this.meterTheaterDBService.addLog({logUserId: socketUser.id, logSocketId: this.socket.id, logMeterId: this.socket.meterId, logDescription: "Check-out"} as ServerLog).subscribe();
        }
      });
    }
  }
}
