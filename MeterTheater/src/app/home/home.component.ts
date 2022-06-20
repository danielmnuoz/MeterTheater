import { Component, OnInit } from '@angular/core';
import { Socket } from '../socket'
import { Meter } from '../meter';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.userService.loginCheck()) {
      this.router.navigateByUrl('login');
    }
  }

  // needs to match other toggle initials (false)
  toggle: boolean = false;
  selectedSocket?: Socket;
  selectedMeter?: Meter;

  selectSocket(socket?: Socket) {
    this.selectedSocket = socket;
  }

  selectMeter(meter?: Meter) {
    this.selectedMeter = meter;
  }
  
  updateInfo(){
    this.toggle=!this.toggle;
  }

}
