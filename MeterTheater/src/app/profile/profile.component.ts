import { Component, OnInit } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket'
import { UserService } from '../user.service';
import { SocketService } from '../socket.service';
import { MeterService } from '../meter.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private meterService: MeterService
  ) { }

  // TODO: wait for login to finish before getting sockets/meters

  ngOnInit(): void {

  }

  ownedSocketIDs: number[] = this.userService.loginUser.socketIDs;
  ownedMeterIDs: number[] = this.userService.loginUser.meterIDs;

}
