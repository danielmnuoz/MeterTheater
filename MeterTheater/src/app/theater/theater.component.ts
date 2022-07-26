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
  selectedSoc?: LocSocket;
  constructor(
    private meterTheaterDBService: MeterTheaterDBService
  ) { }

  ngOnInit(): void {
    var selectedLabId: number | undefined = this.selectedLab?.id;
    var selectedTableId: number | undefined = this.selectedTable?.id;
    this.getSocketInfos(selectedLabId, selectedTableId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    var selectedLabId: number | undefined = this.selectedLab?.id;
    var selectedTableId: number | undefined = this.selectedTable?.id;
    this.getSocketInfos(selectedLabId, selectedTableId);
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
    this.selectedSoc = socket;
  }

  selectMeter(meter: Meter) {
    this.onSelectMeter.emit(meter)
  }

  setSelectedTable(selectedTableId: number | undefined = undefined) {
    if (this.selectedLab != undefined) {
      if (this.selectedLab.tables != undefined) {
        if (this.selectedLab.tables.length > 0) {
          if (selectedTableId == undefined) {
            this.selectedTable = this.selectedLab.tables[0];
          } else {
            for (var table of this.selectedLab.tables) {
              if (table.id == selectedTableId) {
                this.selectedTable = table;
              }
            }
            if (this.selectedTable == undefined) {
              this.selectedTable = this.selectedLab.tables[0];
            }
          }
        }
      }
    }
  }

  getSocketInfos(selectedLabId: number | undefined = undefined, selectedTableId: number | undefined = undefined): void {
    this.meterTheaterDBService.getLabs().subscribe(labs => {
      this.labs = labs;
      if (this.labs && this.labs.length >= 1) {
        if (selectedLabId == undefined) {
          this.selectedLab = this.labs[0];
        } else {
          for (var lab of this.labs) {
            if (lab.id == selectedLabId) {
              this.selectedLab = lab;
            }
          }
          if (this.selectedLab == undefined) {
            this.selectedLab = this.labs[0];
          }
        }
        this.setSelectedTable(selectedTableId);
      }
    });
  }

}
