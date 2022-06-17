import { Component, OnInit } from '@angular/core';
import { User } from '../user';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Router } from '@angular/router'

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  username: string = ''

  onSubmit(){
    this.submitted = true;
    // TODO: check for user not in db
    this.userService.searchUserByName(this.username).subscribe(user => this.userService.loginUser = user[0]);
    this.router.navigateByUrl('home');
  }

}
