import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket'
import { SocketService } from '../socket.service';
import { MeterService } from '../meter.service';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.css']
})
export class TheaterComponent implements OnInit, OnChanges {

  constructor(
    private socketService: SocketService,
    private meterService: MeterService
  ) { }

  ngOnInit(): void {
    this.getSocketsFloor2();
    this.getSocketsFloor6();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getSocketsFloor2();
    this.getSocketsFloor6();
  }

  sockets2: Socket[] = [];
  sockets6: Socket[] = [];

  @Output() onSelectSocket = new EventEmitter<Socket>();
  @Output() onSelectMeter = new EventEmitter<Meter>();
  // needs to match other toggle initials (false)
  @Input() refreshToggle: boolean = false;

  selectSocket(socket: Socket) {
    this.onSelectSocket.emit(socket)
  }

  selectMeter(meter: Meter) {
    this.onSelectMeter.emit(meter)
  }

  getSocketsFloor2(): void {
    this.socketService.searchSocketsByFloor(2)
      .subscribe(sockets => this.sockets2 = sockets);
  }

  getSocketsFloor6(): void {
    this.socketService.searchSocketsByFloor(6)
      .subscribe(sockets => this.sockets6 = sockets);
  }

}
