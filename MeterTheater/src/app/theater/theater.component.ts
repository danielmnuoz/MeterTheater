import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket'
import { MeterTheaterDBService } from '../meter-theater-db.service';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.css']
})
export class TheaterComponent implements OnInit, OnChanges {

  constructor(
    private meterTheaterDBService: MeterTheaterDBService
  ) { }

  ngOnInit(): void {
    this.getSockets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getSockets();
  }

  sockets: Socket[] = [];

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

  // TODO
  getSockets(): void {
    this.meterTheaterDBService.getSockets()
      .subscribe(sockets => this.sockets = sockets);
  }

}
