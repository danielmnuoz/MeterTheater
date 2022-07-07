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
  loginUser: User = this.meterTheaterDBService.loginUser;

  @Input() socket?: Socket;
  @Input() meter?: Meter;
  @Output() onUpdateSocketUser = new EventEmitter<User>();

  getUser(): Observable<User> {
    if (this.socket && this.socket.userId) {
      return this.meterTheaterDBService.getUserById(this.socket.userId);
    } else {
      return of(this.meterTheaterDBService.DEFAULT_USER);
    }
  }

  // TODO: wait for all to finish before profile? also before update theater?
  updateSocketUser(out: boolean) {
    if (this.socket) {
      if (!this.meterTheaterDBService.loginCheck()) {
        return;
      }
      if (out) {
        this.socket.userId = this.meterTheaterDBService.loginUser.id;
        var description: string = "Check-out";
      } else {
        this.socket.userId = undefined;
        var description: string = "Check-in";
      }
      this.getUser().subscribe(socketUser => {
        this.socketUser = socketUser;
        if (this.socket) {
          this.meterTheaterDBService.updateSocket(this.socket).subscribe();
          this.meterTheaterDBService.addLog({ logUserId: this.meterTheaterDBService.loginUser.id, logSocketId: this.socket.id, logMeterId: this.socket.meterId, logDescription: description } as ServerLog).subscribe();
        }
      });
    }
  }

  checkOut() {
    this.updateSocketUser(true);
  }

  checkIn() {
    this.updateSocketUser(false);
  }

}
