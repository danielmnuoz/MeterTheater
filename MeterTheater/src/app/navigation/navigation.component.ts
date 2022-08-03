import { Component, Input, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { MeterTheaterDBService } from '../meter-theater-db.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private meterTheaterDBService: MeterTheaterDBService) { }

  ngOnInit(): void {
  }

  @Input() loginUser: User = this.meterTheaterDBService.DEFAULT_USER;

}
