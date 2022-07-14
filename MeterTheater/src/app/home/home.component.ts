import { Component, OnInit } from '@angular/core';
import { Socket } from '../interfaces/socket'
import { Meter } from '../interfaces/meter';
import { Router } from '@angular/router';
import { MeterTheaterDBService } from '../meter-theater-db.service';

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
    if (!this.meterTheaterDBService.loginCheck()) {
      this.router.navigateByUrl('login');
    }
  }

  // needs to match other toggle initials (false)
  toggle: boolean = false;
  selectedSocket?: Socket;
  selectedMeter?: Meter;
  detailsToggle: boolean = false;

  selectSocket(socket?: Socket) {
    this.selectedSocket = socket;
  }

  selectMeter(meter?: Meter) {
    this.selectedMeter = meter;
  }

  updateInfo(){
    this.toggle=!this.toggle;
  }

  updateDetails(){
    this.detailsToggle = !this.detailsToggle;
  }

}
