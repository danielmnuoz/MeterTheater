import { Component, OnInit } from '@angular/core';
import { LocSocket } from '../interfaces/locSocket';
import { Meter } from '../interfaces/meter';
import { Router } from '@angular/router';
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
          }
        });
      } else {
        this.router.navigateByUrl('login');
      }
    });

  }

  // needs to match other toggle initials (false)
  toggle: boolean = false;
  selectedSocket?: LocSocket;
  selectedMeter?: Meter;
  loginUser: User = this.meterTheaterDBService.DEFAULT_USER;

  selectSocket(socket?: LocSocket) {
    this.selectedSocket = socket;
  }

  selectMeter(meter?: Meter) {
    this.selectedMeter = meter;
  }

  updateInfo() {
    this.toggle = !this.toggle;
  }

}
