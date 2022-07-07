import { Component, OnInit } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket'
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
  sockets: Socket[] = [];

  getSockets() {
    if(this.user.id){
    this.meterTheaterDBService.searchSocketsByUser(this.user.id).subscribe(sockets => this.sockets = sockets);
    }
  }

  getMeters() {
    if(this.user.id){
    this.meterTheaterDBService.searchMetersByUser(this.user.id).subscribe(meters => this.meters = meters);
    }
  }

}
