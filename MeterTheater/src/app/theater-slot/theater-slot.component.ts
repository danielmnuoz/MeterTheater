import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Meter } from '../meter';
import { Socket } from '../socket';
import { MeterService } from '../meter.service';

@Component({
  selector: 'app-theater-slot',
  templateUrl: './theater-slot.component.html',
  styleUrls: ['./theater-slot.component.css']
})
export class TheaterSlotComponent implements OnInit, OnChanges {

  constructor(private meterService: MeterService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMeterByID();
  }

  meter?: Meter;

  @Input() socket?: Socket;
  @Output() onSelectMeter = new EventEmitter<Meter>();
  @Output() onSelectSocket = new EventEmitter<Socket>();

  getMeterByID() {
    if (this.socket) {
      this.meterService.getMeterByID(this.socket.meterID).subscribe(meter => this.meter = meter);
    }
  }

  selectSlot(socket?: Socket, meter?: Meter){
    this.onSelectMeter.emit(meter);
    this.onSelectSocket.emit(socket);
  }

}
