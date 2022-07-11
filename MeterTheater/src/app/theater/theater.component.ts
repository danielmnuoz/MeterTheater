import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket'
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { Lab } from '../interfaces/lab';
import { Table } from '../interfaces/table';

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
    this.getSocketInfos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getSocketInfos();
  }

  labs: Lab[] = [];
  floor: number = 2;

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

  // TODO - sort extendedLabs? and other stuff
  getSocketInfos(): void {
    this.meterTheaterDBService.getLabs().subscribe(labs => {
      this.labs = labs;
    });
  }

}
