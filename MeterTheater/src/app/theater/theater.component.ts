import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket'
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.css']
})
export class TheaterComponent implements OnInit {

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.getSockets();
  }

  @Output() onSelectSocket = new EventEmitter<Socket>();

  sockets: Socket[] = [];

  selectSocket(socket: Socket){
    this.onSelectSocket.emit(socket)
  }

  getSockets(): void {
    this.socketService.getSockets()
      .subscribe(sockets => this.sockets = sockets);
  }

  // add(socket: Socket): void {
  //   name = name.trim();
  //   if (!name) { return; }
  //   this.socketService.addSocket({ name } as Socket)
  //     .subscribe(socket => {
  //       this.sockets.push(socket);
  //     });
  // }

  delete(socket: Socket): void {
    this.sockets = this.sockets.filter(s => s !== socket);
    this.socketService.deleteSocket(socket.id).subscribe();
  }

}
