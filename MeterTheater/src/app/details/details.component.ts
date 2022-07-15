import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket';
import { User } from '../interfaces/user';
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { Observable, of } from 'rxjs';
import { Log } from '../interfaces/log';

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
    this.setInits();
  }

  // needs to match other toggle initials (false)
  toggle: boolean = false;
  out?: boolean;
  socketUser: User = this.meterTheaterDBService.DEFAULT_USER;
  loginUser: User = this.meterTheaterDBService.loginUser;
  meterSerialNumber?: number;
  meterLanId?: string;
  duration?: number;
  errorTexts: string[] = [];

  @Input() socket?: Socket;
  @Input() meter?: Meter;
  @Output() onUpdate = new EventEmitter<boolean>();

  setInits(skipForm: boolean = false) {
    if (!skipForm) {
      if (this.socket != undefined) {
        this.duration = this.socket.duration;
      } else {
        this.duration = undefined;
      }
      if (this.meter != undefined) {
        this.meterSerialNumber = this.meter.serialNumber;
        this.meterLanId = this.meter.lanId;
      } else {
        this.meterSerialNumber = undefined;
        this.meterLanId = undefined;
      }
    }
    if (this.socket?.userId == this.loginUser.id) {
      this.out = false;
    } else {
      this.out = true;
    }
    this.errorTexts = [];
  }

  getUser(): Observable<User> {
    if (this.socket && this.socket.userId) {
      return this.meterTheaterDBService.getUserById(this.socket.userId);
    } else {
      return of(this.meterTheaterDBService.DEFAULT_USER);
    }
  }

  checkOut(duration: number | undefined, meterSerialNumber: number | undefined, meterLanId: string | undefined) {
    if (this.socket) {
      this.socket.userId = this.meterTheaterDBService.loginUser.id;
      if (duration == undefined) {
        this.socket.duration = 7;
      } else {
        this.socket.duration = duration;
      }
      var description: string = "Checkout";
      this.socketUser = this.meterTheaterDBService.loginUser;
      this.meterTheaterDBService.addMeter({ userId: this.meterTheaterDBService.loginUser.id, lanId: meterLanId, serialNumber: meterSerialNumber } as Meter).subscribe(meter => {
        if (this.socket) {
          this.socket.meterId = meter.id;
          this.meterTheaterDBService.checkOutSocket(this.socket).subscribe(_ => {
            if (this.socket?.id) {
              this.meterTheaterDBService.getSocketById(this.socket.id).subscribe(socket => {
                this.socket = socket;
                this.setInits(true);
                this.toggleUpdate();
              });
            }
          });
          this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket?.id, meterId: meter.id, description: description } as Log).subscribe();
        }
      });
    }
  }

  checkIn() {
    if (this.socket) {
      this.socket.userId = undefined;
      this.socket.duration = undefined;
      this.socket.meterId = undefined;
      this.meter = undefined;
      var description: string = "Check-in";
      this.socketUser = this.meterTheaterDBService.DEFAULT_USER;
      if (this.socket) {
        this.meterTheaterDBService.checkInSocket(this.socket).subscribe(_ => {
          if (this.socket?.id) {
            this.meterTheaterDBService.getSocketById(this.socket.id).subscribe(socket => {
              this.socket = socket;
              this.setInits();
              this.toggleUpdate();
            });
          }
        });
        this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket.id, meterId: this.socket.meterId, description: description } as Log).subscribe();
      }
    }
  }

  onSubmit() {
    this.errorTexts = [];
    if (!this.meterTheaterDBService.loginCheck()) {
      this.errorTexts.push("Invalid Login");
      return;
    }
    if (this.out == false) {
      this.checkIn();
    }
    var duration = this.duration;
    var meterSerialNumber = this.meterSerialNumber;
    var meterLanId = this.meterLanId;
    if (this.meterTheaterDBService.loginUser.id != undefined) {
      this.meterTheaterDBService.getUserSockets(this.meterTheaterDBService.loginUser.id).subscribe(sockets => {
        if (sockets.length >= 5) {
          this.errorTexts.push("5 or more sockets are already owned.")
        }
        if (duration && (duration <= 0 || duration > 14)) {
          this.errorTexts.push("Duration must be between 1 and 14 days.");
        }
        if (this.errorTexts.length != 0) {
          return;
        }
        if (this.out == true) {
          this.checkOut(duration, meterSerialNumber, meterLanId);
        }
      })
    } else {
      this.errorTexts.push("Invalid Login");
    }
  }

  toggleUpdate() {
    this.onUpdate.emit(this.toggle);
  }

}
