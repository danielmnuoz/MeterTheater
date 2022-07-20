import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket';
import { LocSocket } from '../interfaces/locSocket';
import { MeterTheaterDBService } from '../meter-theater-db.service';

@Component({
  selector: 'app-theater-slot',
  templateUrl: './theater-slot.component.html',
  styleUrls: ['./theater-slot.component.css']
})
export class TheaterSlotComponent implements OnInit, OnChanges {

  constructor(private meterTheaterDBService: MeterTheaterDBService) { }

  ngOnInit(): void {
    this.loginUserId = this.meterTheaterDBService.loginUser.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getMeterById().subscribe(meter => this.meter = meter);
    this.loginUserId = this.meterTheaterDBService.loginUser.id;
  }

  meter?: Meter;
  loginUserId?: number;

  @Input() socket?: LocSocket;
  @Input() labName?: string;
  @Input() tableName?: string;
  @Output() onSelectMeter = new EventEmitter<Meter>();
  @Output() onSelectSocket = new EventEmitter<LocSocket>();

  getMeterById(): Observable<Meter | undefined> {
    if (this.socket && this.socket.socket && this.socket.socket.meterId) {
      return this.meterTheaterDBService.getMeterById(this.socket.socket.meterId);
    } else {
      return of(undefined);
    }
  }

  selectSlot() {
    this.onSelectSocket.emit(this.socket);
    this.onSelectMeter.emit(this.meter);
  }

}
