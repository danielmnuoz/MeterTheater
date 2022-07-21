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
      this.getMeters();
    }
  }

  @ViewChild(MatTable) socketsTable?: MatTable<any>;

  tableDataSource = new MatTableDataSource<any>();

  user: User = this.meterTheaterDBService.DEFAULT_USER;

  meters: Meter[] = [];

  getMeters() {
    if (this.user.id) {
      this.meterTheaterDBService.searchMetersByUser(this.user.id).subscribe(meters => this.meters = meters);
    }
  }

  // assumes 1 meter id per socket
  getSocketFromWaitSockets(waitSockets: LocSocket[], meterId: number | undefined): LocSocket | undefined {
    if (meterId == undefined) {
      return undefined;
    }
    for (var i: number = 0; i < waitSockets.length; i++) {
      if (waitSockets[i].socket?.meterId == meterId) {
        return waitSockets[i];
      }
    }
    return undefined;
  }

  checkIn(socket: LocSocket, meter: Meter) {
    if (socket && socket.socket) {
      socket.socket.userId = undefined;
      socket.socket.duration = undefined;
      socket.socket.meterId = undefined;
      var description: string = "Check-in";
      if (socket) {
        this.meterTheaterDBService.checkInSocket(socket.socket).subscribe(_ => {
          if (socket?.socket?.id) {
            this.meterTheaterDBService.getSocketById(socket.socket.id).subscribe(socket => {
              this.getSockets();
              this.getMeters()
            });
          }
        });
        this.meterTheaterDBService.addLog({ userId: this.meterTheaterDBService.loginUser.id, socketId: socket.socket.id, meterId: socket.socket.meterId, description: description } as Log).subscribe();
      }
    }
  }

  singleCheckIn(data: any) {
    if (!this.meterTheaterDBService.loginCheck()) {
      return;
    }
    this.checkIn(data.socket, data.meter);
  }

  getSockets() {
    var waitSockets: LocSocket[] = [];
    this.meterTheaterDBService.getLabs().subscribe(labs => {
      this.tableDataSource.data = [];
      for (var lab of labs) {
        if (lab.tables) {
          for (var table of lab.tables) {
            if (table.sockets) {
              for (var row of table.sockets) {
                for (var socket of row) {
                  if (socket != undefined) {
                    if (this.user.id != undefined && socket.socket != undefined && socket.socket.userId == this.user.id) {
                      if (socket.socket.meterId != undefined) {
                        waitSockets.push(socket);
                        this.meterTheaterDBService.getMeterById(socket.socket.meterId).subscribe(meter => {
                          var socket = this.getSocketFromWaitSockets(waitSockets, meter.id);
                          this.tableDataSource.data.push({ socket, meter });
                          this.socketsTable?.renderRows();
                        });
                      } else {
                        this.tableDataSource.data.push({ socket, undefined });
                        this.socketsTable?.renderRows();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

}
