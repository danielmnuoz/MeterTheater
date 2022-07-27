import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { Log } from '../interfaces/log';

import { Router } from '@angular/router'

import { MeterTheaterDBService } from '../meter-theater-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;

  constructor(
    private router: Router,
    private meterTheaterDBService: MeterTheaterDBService
  ) { }

  ngOnInit(): void {
    this.meterTheaterDBService.resetLoginUser().subscribe();
  }

  username: string = '';
  potentialMatches: User[] = [];
  found: boolean = true;

  onSubmit() {
    var username: string = this.username;
    this.submitted = true;
    this.meterTheaterDBService.postLoginUser(username).subscribe(user => {
      if (user == undefined) {
        this.found = false;
        var log: Log = {
          description: `Failed Login: ${username}`,
        };
        this.meterTheaterDBService.addLog(log).subscribe();
      } else {
        this.found = true;
        this.meterTheaterDBService.loginUser = user;
        var log: Log = {
          description: "Successful Login",
          userId: this.meterTheaterDBService.loginUser.id
        };
        this.meterTheaterDBService.addLog(log).subscribe();
        // this should be in subscribe so that the rest of the website waits for user before querying db
        this.router.navigateByUrl('home');
      }
    });
  }

}
