import { Component, OnInit } from '@angular/core';
import { MeterTheaterDBService } from '../meter-theater-db.service';

@Component({
  selector: 'app-net-error',
  templateUrl: './net-error.component.html',
  styleUrls: ['./net-error.component.css']
})
export class NetErrorComponent implements OnInit {

  constructor(
    private meterTheaterDbService: MeterTheaterDBService
  ) { }

  ngOnInit(): void {
  }

  api = this.meterTheaterDbService.APIURL;
  site = this.meterTheaterDbService.SITEURL;

}
