import { Component, OnInit } from '@angular/core';
import { Log } from '../interfaces/log';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router'

import { MeterTheaterDBService } from '../meter-theater-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private meterTheaterDBService: MeterTheaterDBService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.meterTheaterDBService.getCheckLogin().subscribe(ret => {
      if (ret == true) {
        this.meterTheaterDBService.getLogout().subscribe();
      }
    });
  }

  found: boolean = true;
  disableLogin: boolean = false;

  loginForm = this.fb.group({
    username: ['', [Validators.required]]
  });

  onSubmit() {
    this.disableLogin = true;
    var username: string | undefined = this.loginForm.get('username')?.value?.toString();
    if (username == undefined) {
      username = '';
    }
    this.meterTheaterDBService.postLoginUser(username).subscribe(user => {
      if (user == undefined) {
        this.found = false;
        this.disableLogin = false;
      } else {
        this.found = true;
        var log: Log = {
          description: "Successful Login",
          userId: user.id
        };
        this.disableLogin = false;
        this.meterTheaterDBService.addLog(log).subscribe();
        this.router.navigateByUrl('home');
        return;
      }
    });
  }

}
