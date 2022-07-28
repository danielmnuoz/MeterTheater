import { Component, OnInit, ViewChild } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket';
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
    if (!this.meterTheaterDBService.loginCheck()) {
      this.router.navigateByUrl('login');
    } else {
      this.user = this.meterTheaterDBService.loginUser;
      this.getSockets();
    }
  }

  @ViewChild(MatTable) socketsTable?: MatTable<any>;

  tableDataSource = new MatTableDataSource<any>();

  user: User = this.meterTheaterDBService.DEFAULT_USER;
  checkInDisable: boolean = false;

  checkIn(socket: LocSocket, meter: Meter) {
    if (socket && socket.socket) {
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
              this.getSockets();
            });
          }
        });
        this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: socket.socket.id, meterId: meterId, description: description } as Log).subscribe();
      }
    } else {
      this.checkInDisable = false;
    }
  }

  singleCheckIn(data: any) {
    this.checkInDisable = true;
    if (!this.meterTheaterDBService.loginCheck()) {
      this.checkInDisable = false;
      return;
    }
    this.checkIn(data.socket, data.meter);
  }

  getSockets() {
    this.meterTheaterDBService.getLabs().subscribe(labs => {
      this.tableDataSource.data = [];
      for (var lab of labs) {
        if (lab.tables) {
          for (var table of lab.tables) {
            if (table.sockets) {
              for (var row of table.sockets) {
                row.forEach(socket => {
                  if (socket != undefined) {
                    if (this.user.id != undefined && socket.socket != undefined && socket.socket.userId == this.user.id) {
                      if (socket.socket.meterId != undefined) {
                        this.meterTheaterDBService.getMeterById(socket.socket.meterId).subscribe(meter => {
                          this.tableDataSource.data.push({ socket, meter });
                          this.socketsTable?.renderRows();
                        });
                      } else {
                        this.tableDataSource.data.push({ socket, undefined });
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
