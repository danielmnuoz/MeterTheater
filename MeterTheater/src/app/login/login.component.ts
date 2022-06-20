import { Component, OnInit } from '@angular/core';
import { User } from '../user';

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
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.resetLoginUser();
  }

  username: string = '';
  potentialMatches: User[] = [];
  found: boolean = true;

  onSubmit() {
    var username: string = this.username;
    var found: boolean = false;
    this.submitted = true;
    this.userService.searchUserByName(username).subscribe(users => {
      for (var user of users) {
        if (user.name.length == username.length) {
          this.userService.loginUser = user;
          found = true;
          break;
        }
      }
      if(found){
        // this should be in subscribe so that the rest of the website waits for user before querying db
        this.router.navigateByUrl('home');
      }else{
        this.found = false;
      }
    }
    );
  }

}
