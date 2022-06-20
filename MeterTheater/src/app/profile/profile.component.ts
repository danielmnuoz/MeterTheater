import { Component, OnInit } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket'
import { User } from '../user';
import { UserService } from '../user.service';
import { SocketService } from '../socket.service';
import { MeterService } from '../meter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private meterService: MeterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.userService.loginCheck()) {
      this.router.navigateByUrl('login');
    }else{
      this.getSockets();
      this.getMeters();
    }
  }

  user: User = this.userService.loginUser;

  ownedSocketIDs: number[] = this.userService.loginUser.socketIDs;
  ownedMeterIDs: number[] = this.userService.loginUser.meterIDs;

  meters: Meter[] = [];
  sockets: Socket[] = [];

  getSockets(){
    for (var id of this.ownedSocketIDs){
      this.socketService.getSocketByID(id).subscribe(socket => {this.sockets.push(socket)});
    }
  }

  getMeters(){
    for (var id of this.ownedMeterIDs){
      this.meterService.getMeterByID(id).subscribe(meter => {this.meters.push(meter)});
    }
  }

}
