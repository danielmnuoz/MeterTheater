import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { ServerLog } from '../interfaces/serverLog';

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
    this.meterTheaterDBService.resetLoginUser();
  }

  username: string = '';
  potentialMatches: User[] = [];
  found: boolean = true;

  onSubmit() {
    var username: string = this.username;
    var found: boolean = false;
    this.submitted = true;
    this.meterTheaterDBService.searchUserByName(username).subscribe(users => {
      for (var user of users) {
        if(!user.name){
          continue;
        }
        if (user.name.length == username.length && user.name.toLowerCase() === username.toLowerCase()) {
          this.meterTheaterDBService.loginUser = user;
          found = true;
          break;
        }
      }
      if(found){
        var log: ServerLog = {
          logDescription: "Successful Login",
          logUserId: this.meterTheaterDBService.loginUser.id
        };
        this.meterTheaterDBService.addLog(log).subscribe();
        // this should be in subscribe so that the rest of the website waits for user before querying db
        this.router.navigateByUrl('home');
      }else{
        this.found = false;
        var log: ServerLog = {
          logDescription: `Failed Login: ${username}`,
        };
        this.meterTheaterDBService.addLog(log).subscribe();
      }
    }
    );
  }

}
