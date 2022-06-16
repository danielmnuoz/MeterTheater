import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../user';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  @Output() onLogin = new EventEmitter<string>();

  user: User = {
    id: 0,
    name: 'Name'
  }

  login(name?: string){
    this.user.name = name;
    this.onLogin.emit(name);
    this.router.navigateByUrl('home');
  }

}
