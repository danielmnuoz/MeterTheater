import { Component, OnInit } from '@angular/core';
import { User } from '../user';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Router } from '@angular/router'

import { SocketService } from '../socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private socketService: SocketService
  ) { }

  ngOnInit(): void {
  }

  login(name?: string) {
    if (name) {
      this.socketService.user.name = name;
    } else {
      this.socketService.user.name = '';
    }
    // this.onLogin.emit(name);
    this.router.navigateByUrl('home');
  }

}
