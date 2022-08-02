import { Component, OnInit, ViewChild } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { LocSocket } from '../interfaces/locSocket';
import { Log } from '../interfaces/log';
import { User } from '../interfaces/user';
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private meterTheaterDBService: MeterTheaterDBService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.meterTheaterDBService.getCheckLogin().subscribe(ret => {
      if (ret == true) {
        this.meterTheaterDBService.getLoginUser().subscribe(users => {
          if (users == undefined || users.length == 0) {
            this.router.navigateByUrl('login');
          } else {
            // assumes unique
            this.loginUser = users[0];
            this.getSockets();
          }
        });
      } else {
        this.router.navigateByUrl('login');
      }
    });
  }

  @ViewChild(MatTable) socketsTable?: MatTable<any>;

  tableStandardDataSource = new MatTableDataSource<any>();
  tableAdminDataSource = new MatTableDataSource<any>();

  loginUser: User = this.meterTheaterDBService.DEFAULT_USER;
  checkInDisable: boolean = false;
  selectedView?: string;
  refreshCheckinError: boolean = false;

  checkIn(socket: LocSocket, meter: Meter) {
    if (socket && socket.socket && socket.socket.id != undefined) {
      this.meterTheaterDBService.getSocketById(socket.socket.id).subscribe(checkSocket => {
        if (checkSocket.userId == undefined) {
          this.refreshCheckinError = true;
          this.checkInDisable = false;
          return;
        } else if (socket && socket.socket) {
          this.refreshCheckinError = false;
          socket.socket.userId = undefined;
          socket.socket.duration = undefined;
          socket.socket.comment = undefined;
          var meterId: number | undefined = socket.socket.meterId;
          socket.socket.meterId = undefined;
          var description: string = "Check-in";
          // always true
          if (socket) {
            this.meterTheaterDBService.checkInSocket(socket.socket).subscribe(_ => {
              // always true
              if (socket?.socket?.id) {
                this.meterTheaterDBService.getSocketById(socket.socket.id).subscribe(socket => {
                  if (meterId != undefined) {
                    this.meterTheaterDBService.getMeterById(meterId).subscribe(meter => {
                      meter.userId = undefined;
                      this.meterTheaterDBService.updateMeter(meter).subscribe(_ => {
                        this.checkInDisable = false;
                      });
                    })
                  } else {
                    this.checkInDisable = false;
                  }
                  this.getSockets(this.selectedView);
                });
              }
            });
            this.meterTheaterDBService.addLog({ userId: this.loginUser.id, socketId: socket.socket.id, meterId: meterId, description: description } as Log).subscribe();
          }
        } else {
          this.checkInDisable = false;
        }
      });
    } else {
      this.checkInDisable = false;
    }
  }

  singleCheckIn(data: any) {
    this.checkInDisable = true;
    this.meterTheaterDBService.getCheckLogin().subscribe(ret => {
      if (ret == true) {
        this.checkIn(data.socket, data.meter);
      } else {
        this.router.navigateByUrl('login');
      }
    });
  }

  getSockets(selectedView: string | undefined = undefined) {
    if (selectedView != undefined) {
      this.selectedView = selectedView;
    } else {
      this.selectedView = "standard";
    }
    this.meterTheaterDBService.getLabs().subscribe(labs => {
      this.tableStandardDataSource.data = [];
      this.tableAdminDataSource.data = [];
      for (var lab of labs) {
        if (lab.tables) {
          for (var table of lab.tables) {
            if (table.sockets) {
              for (var row of table.sockets) {
                row.forEach(socket => {
                  if (socket != undefined) {
                    if (this.loginUser.id != undefined && socket.socket != undefined && socket.socket.userId == this.loginUser.id) {
                      if (socket.socket.meterId != undefined) {
                        this.meterTheaterDBService.getMeterById(socket.socket.meterId).subscribe(meter => {
                          this.tableStandardDataSource.data.push({ socket, meter });
                          this.socketsTable?.renderRows();
                        });
                      } else {
                        this.tableStandardDataSource.data.push({ socket, undefined });
                        this.socketsTable?.renderRows();
                      }
                    }
                    if (socket.socket != undefined && socket.socket.userId != undefined) {
                      if (socket.socket.meterId != undefined) {
                        this.meterTheaterDBService.getMeterById(socket.socket.meterId).subscribe(meter => {
                          this.tableAdminDataSource.data.push({ socket, meter });
                          this.socketsTable?.renderRows();
                        });
                      } else {
                        this.tableAdminDataSource.data.push({ socket, undefined });
                        this.socketsTable?.renderRows();
                      }
                    }
                  }
                });
              }
            }
          }
        }
      }
    });
  }

}
