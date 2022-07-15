import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket';
import { MeterTheaterDBService } from '../meter-theater-db.service';

@Component({
  selector: 'app-theater-slot',
  templateUrl: './theater-slot.component.html',
  styleUrls: ['./theater-slot.component.css']
})
export class TheaterSlotComponent implements OnInit, OnChanges {

  constructor(private meterTheaterDBService: MeterTheaterDBService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMeterById().subscribe(meter => this.meter = meter);
  }

  meter?: Meter;

  @Input() socket?: Socket;
  @Output() onSelectMeter = new EventEmitter<Meter>();
  @Output() onSelectSocket = new EventEmitter<Socket>();

  getMeterById(): Observable<Meter | undefined> {
    if (this.socket && this.socket.meterId) {
      return this.meterTheaterDBService.getMeterById(this.socket.meterId);
    } else {
      return of(undefined);
    }
  }

  selectSlot() {
    this.onSelectSocket.emit(this.socket);
    this.onSelectMeter.emit(this.meter);
  }

}
