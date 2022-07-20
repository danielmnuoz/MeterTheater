import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket'
import { LocSocket } from '../interfaces/locSocket';
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
  selectedLab?: Lab;
  selectedTable?: Table;

  @Output() onSelectSocket = new EventEmitter<LocSocket>();
  @Output() onSelectMeter = new EventEmitter<Meter>();
  @Output() onSelect = new EventEmitter<boolean>();
  // needs to match other toggle initials (false)
  @Input() refreshToggle: boolean = false;

  selectSocket(socket: LocSocket) {
    this.onSelectSocket.emit(socket)
  }

  selectMeter(meter: Meter) {
    this.onSelectMeter.emit(meter)
  }

  setSelectedTable() {
    if (this.selectedLab != undefined) {
      if (this.selectedLab.tables != undefined) {
        if (this.selectedLab.tables.length > 0) {
          this.selectedTable = this.selectedLab.tables[0];
        }
      }
    }
  }

  getSocketInfos(): void {
    this.meterTheaterDBService.getLabs().subscribe(labs => {
      this.labs = labs;
      if (this.labs && this.labs.length >= 1) {
        this.selectedLab = this.labs[0];
        this.setSelectedTable();
      }
    });
  }

}
