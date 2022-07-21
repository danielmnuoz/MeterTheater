import { Component, OnInit } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket';
import { LocSocket } from '../interfaces/locSocket';
import { User } from '../interfaces/user';
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { Router } from '@angular/router';

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
      this.getSockets();
      this.getMeters();
    }
  }

  user: User = this.meterTheaterDBService.loginUser;

  meters: Meter[] = [];
  sockets: LocSocket[] = [];

  getMeters() {
    if (this.user.id) {
      this.meterTheaterDBService.searchMetersByUser(this.user.id).subscribe(meters => this.meters = meters);
    }
  }

  getSockets() {
    this.meterTheaterDBService.getLabs().subscribe(labs => {
      this.sockets = [];
      for (var lab of labs) {
        if (lab.tables) {
          for (var table of lab.tables) {
            if (table.sockets) {
              for (var row of table.sockets) {
                for (var socket of row) {
                  if (socket != undefined) {
                    if (this.user.id != undefined && socket.socket && socket.socket.userId == this.user.id) {
                      this.sockets.push(socket);
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
