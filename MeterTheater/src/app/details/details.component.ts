import { Component, Input, OnInit, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { LocSocket } from '../interfaces/locSocket';
import { User } from '../interfaces/user';
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { Observable, of } from 'rxjs';
import { Log } from '../interfaces/log';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnChanges, OnDestroy {

  constructor(
    private meterTheaterDBService: MeterTheaterDBService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getUser().subscribe(socketUser => this.socketUser = socketUser);
    this.setInits();
  }

  ngOnDestroy(): void {
    if (this.snackBarRef != undefined) {
      this.snackBarRef.dismiss();
    }
  }

  // needs to match other toggle initials (false)
  toggle: boolean = false;
  out?: boolean;
  socketUser: User = this.meterTheaterDBService.DEFAULT_USER;
  loginUser: User = this.meterTheaterDBService.loginUser;
  countError: boolean = false;
  meterUseError: boolean = false;
  errorMeterUser?: User;
  refreshError: boolean = false;
  snackBarRef?: MatSnackBarRef<TextOnlySnackBar>;

  useText: string = ' is already using that meter.';
  sameUserText: string = 'You own this meter, but you are using it somewhere else. Please Check-in the meter.';

  @Input() socket?: LocSocket;
  @Input() meter?: Meter;
  @Output() onUpdate = new EventEmitter<boolean>();

  detailsForm = this.fb.group({
    meterLanId: [this.meter?.lanId, [Validators.pattern("[a-fA-F0-9]*"), Validators.minLength(8), Validators.maxLength(8)]],
    duration: [this.socket?.socket?.duration, [Validators.pattern("[1-9][0-9]*"), Validators.min(1), Validators.max(14), Validators.required]],
    comment: [this.socket?.socket?.comment, [Validators.maxLength(100)]]
  });

  setInits(skipForm: boolean = false) {
    this.refreshError = false;
    this.errorMeterUser = undefined;
    this.meterUseError = false;
    if (this.socket?.socket?.userId == this.loginUser.id) {
      this.out = false;
    } else if (this.socket?.socket?.userId == undefined) {
      this.out = true;
    } else {
      this.out = undefined;
    }
    if (this.out != true) {
      this.detailsForm.get('duration')?.disable();
      this.detailsForm.get('meterLanId')?.disable();
      this.detailsForm.get('comment')?.disable();
    } else {
      this.detailsForm.get('duration')?.enable();
      this.detailsForm.get('meterLanId')?.enable();
      this.detailsForm.get('comment')?.enable();
    }
    if (!skipForm) {
      if (this.socket != undefined && this.socket.socket != undefined) {
        this.detailsForm.get('comment')?.setValue(this.socket.socket.comment);
        if (this.socket.socket.duration != undefined) {
          this.detailsForm.get('duration')?.setValue(this.socket.socket.duration);
        } else {
          this.detailsForm.get('duration')?.setValue(1);
        }
      } else {
        this.detailsForm.get('duration')?.setValue(undefined);
        this.detailsForm.get('comment')?.setValue(undefined);
      }
      if (this.meter != undefined) {
        this.detailsForm.get('meterLanId')?.setValue(this.meter.lanId);
      } else {
        this.detailsForm.get('meterLanId')?.setValue(undefined);
      }
    }
  }

  getUser(): Observable<User> {
    if (this.socket != undefined && this.socket.socket != undefined && this.socket.socket.userId) {
      return this.meterTheaterDBService.getUserById(this.socket.socket.userId);
    } else {
      return of(this.meterTheaterDBService.DEFAULT_USER);
    }
  }

  checkOut(duration: number | undefined, meterLanId: string | undefined, comment: string | undefined) {
    if (this.socket != undefined && this.socket.socket != undefined) {
      if (this.socket.socket.id == undefined) {
        return;
      }
      this.meterTheaterDBService.getSocketById(this.socket.socket.id).subscribe(socket => {
        if (socket.userId != undefined) {
          this.refreshError = true;
          return;
        } else {
          this.refreshError = false;
          if (this.socket != undefined && this.socket.socket != undefined) {
            this.socket.socket.userId = this.meterTheaterDBService.loginUser.id;
            this.socket.socket.duration = duration;
            this.socket.socket.comment = comment;
            this.socketUser = this.meterTheaterDBService.loginUser;
            if (meterLanId != undefined) {
              this.meterTheaterDBService.searchMetersByLanId(meterLanId).subscribe(meters => {
                // assumes unique
                if (meters.length != 0) {
                  this.meterTheaterDBService.updateMeter({ id: meters[0].id, userId: this.meterTheaterDBService.loginUser.id, lanId: meterLanId, serialNumber: undefined } as Meter).subscribe(_ => {
                    if (this.socket && this.socket.socket) {
                      this.socket.socket.meterId = meters[0].id;
                      this.meterTheaterDBService.checkOutSocket(this.socket.socket).subscribe(_ => {
                        if (this.socket?.socket?.id) {
                          this.meterTheaterDBService.getSocketById(this.socket.socket.id).subscribe(socket => {
                            if (this.socket) {
                              this.socket.socket = socket;
                            }
                            this.setInits(true);
                            this.toggleUpdate();
                          });
                        }
                      });
                      var description: string = "Checkout: Meter Updated";
                      this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket.socket.id, meterId: meters[0].id, description: description } as Log).subscribe();
                    }
                  });
                } else {
                  this.checkOutAddMeter(meterLanId);
                }
              });
            } else {
              if (this.socket && this.socket.socket) {
                this.socket.socket.meterId = undefined;
                this.meterTheaterDBService.checkOutSocket(this.socket.socket).subscribe(_ => {
                  if (this.socket?.socket?.id) {
                    this.meterTheaterDBService.getSocketById(this.socket.socket.id).subscribe(socket => {
                      if (this.socket != undefined) {
                        this.socket.socket = socket;
                      }
                      this.setInits(true);
                      this.toggleUpdate();
                    });
                  }
                });
                var description: string = "Checkout";
                this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket.socket.id, meterId: undefined, description: description } as Log).subscribe();
              }
            }
          }
        }
      });
    }
  }

  checkOutAddMeter(meterLanId: string | undefined) {
    this.meterTheaterDBService.addMeter({ userId: this.meterTheaterDBService.loginUser.id, lanId: meterLanId, serialNumber: undefined } as Meter).subscribe(meter => {
      if (this.socket && this.socket.socket != undefined) {
        this.socket.socket.meterId = meter.id;
        this.meterTheaterDBService.checkOutSocket(this.socket.socket).subscribe(_ => {
          if (this.socket?.socket?.id) {
            this.meterTheaterDBService.getSocketById(this.socket.socket.id).subscribe(socket => {
              if (this.socket) {
                this.socket.socket = socket;
              }
              this.setInits(true);
              this.toggleUpdate();
            });
          }
        });
        var description: string = "Checkout: Meter Added";
        this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket.socket.id, meterId: meter.id, description: description } as Log).subscribe();
      }
    });
  }

  checkIn() {
    if (this.socket && this.socket.socket) {
      this.socket.socket.userId = undefined;
      this.socket.socket.duration = undefined;
      this.socket.socket.comment = undefined;
      var meterId: number | undefined = this.socket.socket.meterId;
      this.socket.socket.meterId = undefined;
      this.meter = undefined;
      var description: string = "Check-in";
      this.socketUser = this.meterTheaterDBService.DEFAULT_USER;
      if (this.socket) {
        this.meterTheaterDBService.checkInSocket(this.socket.socket).subscribe(_ => {
          if (this.socket?.socket?.id) {
            this.meterTheaterDBService.getSocketById(this.socket.socket.id).subscribe(socket => {
              if (this.socket) {
                this.socket.socket = socket;
              }
              if (meterId != undefined) {
                this.meterTheaterDBService.getMeterById(meterId).subscribe(meter => {
                  meter.userId = undefined;
                  this.meterTheaterDBService.updateMeter(meter).subscribe();
                })
              }
              this.setInits();
              this.toggleUpdate();
            });
          }
        });
        this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: this.socket.socket.id, meterId: meterId, description: description } as Log).subscribe();
      }
    }
  }

  onSubmit() {
    if (!this.meterTheaterDBService.loginCheck()) {
      return;
    }
    if (this.out == false) {
      this.countError = false;
      if (this.snackBarRef != undefined) {
        this.snackBarRef.dismiss();
      }
      this.checkIn();
      return;
    }
    var duration: number | undefined = this.detailsForm.get('duration')?.value?.valueOf();
    var meterLanId = this.detailsForm.get('meterLanId')?.value?.toString();
    var comment: string | undefined = this.detailsForm.get('comment')?.value?.toString();
    if (this.meterTheaterDBService.loginUser.id != undefined) {
      this.meterTheaterDBService.getUserSockets(this.meterTheaterDBService.loginUser.id).subscribe(sockets => {
        if (sockets.length >= 5) {
          this.countError = true;
          this.snackBarRef = this._snackBar.open("You already have 5 sockets. Consider checking a socket back in.", "Close");
        } else {
          this.countError = false;
          if (this.snackBarRef != undefined) {
            this.snackBarRef.dismiss();
          }
        }
        if (meterLanId != undefined) {
          this.meterTheaterDBService.searchMetersByLanId(meterLanId).subscribe(meters => {
            //assumes unique
            if (meters.length > 0) {
              if (meters[0].userId != undefined) {
                this.meterUseError = true;
                this.meterTheaterDBService.getUserById(meters[0].userId).subscribe(user => {
                  this.errorMeterUser = user;
                });
                return;
              } else {
                this.meterUseError = false;
              }
              if (this.out == true) {
                this.checkOut(duration, meterLanId, comment);
                return;
              }
            } else {
              this.meterUseError = false;
              if (this.out == true) {
                this.checkOut(duration, meterLanId, comment);
                return;
              }
            }
          });
        } else {
          this.meterUseError = false;
          if (this.out == true) {
            this.checkOut(duration, meterLanId, comment);
            return;
          }
        }
      });
    }
  }

  toggleUpdate() {
    this.onUpdate.emit(this.toggle);
  }

}
