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

  @Input() refreshToggle: boolean = false;
  @Input() socket?: Socket;
  @Input() meter?: Meter;
  @Output() onUpdate = new EventEmitter<boolean>();

  setInits() {
    if(this.socket != undefined){
      this.duration = this.socket.duration;
    }else{
      this.duration = undefined;
    }
    if(this.meter != undefined){
      this.meterSerialNumber = this.meter.serialNumber;
      this.meterLanId = this.meter.lanId;
    }else{
      this.meterSerialNumber = undefined;
      this.meterLanId = undefined;
    }
    if (this.socket?.userId == this.loginUser.id) {
      this.out = false;
    } else {
      this.out = true;
    }
  }

  getUser(): Observable<User> {
    if (this.socket && this.socket.userId) {
      return this.meterTheaterDBService.getUserById(this.socket.userId);
    } else {
      return of(this.meterTheaterDBService.DEFAULT_USER);
    }
  }

  checkOut() {
    if (this.socket) {
      this.socket.userId = this.meterTheaterDBService.loginUser.id;
      this.socket.duration = this.duration;
      var description: string = "Checkout";
      this.socketUser = this.meterTheaterDBService.loginUser;
      this.meterTheaterDBService.addMeter({ userId: this.meterTheaterDBService.loginUser.id, lanId: this.meterLanId, serialNumber: this.meterSerialNumber } as Meter).subscribe(meter => {
        this.meter = meter;
        if (this.socket) {
          this.socket.meterId = this.meter.id;
          this.meterTheaterDBService.checkOutSocket(this.socket).subscribe(_ => {
            if (this.socket?.id) {
              this.meterTheaterDBService.getSocketById(this.socket.id).subscribe(socket => {
                this.socket = socket;
                this.setInits();
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
      var description: string = "Check-in";
      this.socketUser = this.meterTheaterDBService.DEFAULT_USER;
      if (this.socket) {
        this.meterTheaterDBService.checkInSocket(this.socket).subscribe(_ => {
          if (this.socket?.id) {
            this.meterTheaterDBService.getSocketById(this.socket.id).subscribe(socket => {
              this.socket = socket;
              this.meter = undefined;
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
    if (!this.meterTheaterDBService.loginCheck()) {
      return;
    }
    if (this.out == true) {
      this.checkOut();
    }
    else if (this.out == false) {
      this.checkIn();
    }
  }

  toggleUpdate() {
    this.setInits();
    this.toggle = !this.toggle;
    this.onUpdate.emit(this.toggle);
  }

}
