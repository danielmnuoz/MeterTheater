import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket';
import { User } from '../interfaces/user';
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { Observable, of } from 'rxjs';
import { Log } from '../interfaces/log';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnChanges {

  constructor(
    private meterTheaterDBService: MeterTheaterDBService,
    private fb: FormBuilder
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
  countError: boolean = false;

  @Input() socket?: Socket;
  @Input() meter?: Meter;
  @Output() onUpdate = new EventEmitter<boolean>();

  detailsForm = this.fb.group({
    meterLanId: [this.meter?.lanId, [Validators.pattern("[a-zA-Z0-9]*"), Validators.minLength(8), Validators.maxLength(8)]],
    duration: [this.socket?.duration, [Validators.pattern("[1-9][0-9]*"), Validators.min(1), Validators.max(14), Validators.required]]
  });

  setInits(skipForm: boolean = false) {
    if (this.socket?.userId == this.loginUser.id) {
      this.out = false;
    } else if (this.socket?.userId == undefined) {
      this.out = true;
    } else {
      this.out = undefined;
    }
    if (this.out != true) {
      this.detailsForm.get('duration')?.disable()
      this.detailsForm.get('meterLanId')?.disable()
    } else {
      this.detailsForm.get('duration')?.enable()
      this.detailsForm.get('meterLanId')?.enable()
    }
    if (!skipForm) {
      if (this.socket != undefined) {
        this.detailsForm.get('duration')?.setValue(this.socket.duration);
      } else {
        this.detailsForm.get('duration')?.setValue(undefined);
      }
      if (this.meter != undefined) {
        this.detailsForm.get('meterLanId')?.setValue(this.meter.lanId);
      } else {
        this.detailsForm.get('meterLanId')?.setValue(undefined);
      }
    }
  }

  getUser(): Observable<User> {
    if (this.socket && this.socket.userId) {
      return this.meterTheaterDBService.getUserById(this.socket.userId);
    } else {
      return of(this.meterTheaterDBService.DEFAULT_USER);
    }
  }

  checkOut(duration: number | undefined, meterLanId: string | undefined) {
    if (this.socket) {
      this.socket.userId = this.meterTheaterDBService.loginUser.id;
      this.socket.duration = duration;
      this.socketUser = this.meterTheaterDBService.loginUser;
      if (meterLanId != undefined) {
        this.meterTheaterDBService.searchMetersByLanId(meterLanId).subscribe(meters => {
          // assumes unique
          if (meters.length != 0) {
            this.meterTheaterDBService.updateMeter({ id: meters[0].id, userId: this.meterTheaterDBService.loginUser.id, lanId: meterLanId, serialNumber: undefined } as Meter).subscribe(_ => {
              if (this.socket) {
                this.socket.meterId = meters[0].id;
                this.meterTheaterDBService.checkOutSocket(this.socket).subscribe(_ => {
                  if (this.socket?.id) {
                    this.meterTheaterDBService.getSocketById(this.socket.id).subscribe(socket => {
                      this.socket = socket;
                      this.setInits(true);
                      this.toggleUpdate();
                    });
                  }
                });
                var description: string = "Checkout: Meter Updated";
                this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket?.id, meterId: meters[0].id, description: description } as Log).subscribe();
              }
            });
          } else {
            this.checkOutAddMeter(meterLanId);
          }
        });
      } else {
        if (this.socket) {
          this.socket.meterId = undefined;
          this.meterTheaterDBService.checkOutSocket(this.socket).subscribe(_ => {
            if (this.socket?.id) {
              this.meterTheaterDBService.getSocketById(this.socket.id).subscribe(socket => {
                this.socket = socket;
                this.setInits(true);
                this.toggleUpdate();
              });
            }
          });
          var description: string = "Checkout";
          this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket?.id, meterId: undefined, description: description } as Log).subscribe();
        }
      }
    }
  }

  checkOutAddMeter(meterLanId: string | undefined) {
    this.meterTheaterDBService.addMeter({ userId: this.meterTheaterDBService.loginUser.id, lanId: meterLanId, serialNumber: undefined } as Meter).subscribe(meter => {
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
        var description: string = "Checkout: Meter Added";
        this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket?.id, meterId: meter.id, description: description } as Log).subscribe();
      }
    });
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
    if (!this.meterTheaterDBService.loginCheck()) {
      return;
    }
    if (this.out == false) {
      this.checkIn();
    }
    var duration: number | undefined = this.detailsForm.get('duration')?.value?.valueOf();
    var meterLanId = this.detailsForm.get('meterLanId')?.value?.toString();
    if (this.meterTheaterDBService.loginUser.id != undefined) {
      this.meterTheaterDBService.getUserSockets(this.meterTheaterDBService.loginUser.id).subscribe(sockets => {
        if (sockets.length >= 5) {
          this.countError = true;
          return;
        } else {
          this.countError = false;
        }
        if (this.out == true) {
          this.checkOut(duration, meterLanId);
        }
      })
    }
  }

  toggleUpdate() {
    this.onUpdate.emit(this.toggle);
  }

}
