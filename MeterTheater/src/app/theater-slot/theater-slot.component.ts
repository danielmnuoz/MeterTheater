import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket';
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
    this.getMeterById();
  }

  meter?: Meter;

  @Input() socket?: Socket;
  @Output() onSelectMeter = new EventEmitter<Meter>();
  @Output() onSelectSocket = new EventEmitter<Socket>();

  getMeterById() {
    if (this.socket && this.socket.meterId) {
      this.meterTheaterDBService.getMeterById(this.socket.meterId).subscribe(meter => this.meter = meter);
    }
  }

  selectSlot(socket?: Socket, meter?: Meter){
    this.onSelectMeter.emit(meter);
    this.onSelectSocket.emit(socket);
  }

}
