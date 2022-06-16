import { Component, OnInit } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket'
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.searchSockets()
  }

  ownedSockets: Socket[] = [];

  searchSockets(): void {
    this.socketService.searchSockets(this.socketService.user.name)
      .subscribe(sockets => this.ownedSockets = sockets);
  }

}
