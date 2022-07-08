import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Meter } from '../interfaces/meter';
import { Socket } from '../interfaces/socket'
import { MeterTheaterDBService } from '../meter-theater-db.service';
import { ExtendedLab } from '../interfaces/extendedLab';

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

  sockets: Socket[] = [];
  extendedLabs: ExtendedLab[] = [];

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
    this.meterTheaterDBService.getExtendedLabs().subscribe(extendedLabs => {
      this.extendedLabs = extendedLabs;
      this.sockets = [];
      for (var extendedLab of extendedLabs) {
        if (extendedLab.floor == 2) {
          if (extendedLab.locations) {
            extendedLab.locations = extendedLab.locations.sort((a,b)=>{
              if(a.row && b.row && a.row > b.row){
                return 1
              }else if(a.row && b.row && a.row < b.row){
                return -1
              }else if(a.row && b.row && a.row == b.row && a.col && b.col && a.col > b.col){
                return 1
              }else if(a.row && b.row && a.row == b.row && a.col && b.col && a.col < b.col){
                return -1
              }
              return 0
            });
            for (var location of extendedLab.locations){
              if(location.sockets){
                for (var socket of location.sockets){
                  this.sockets.push(socket);
                }
              }
            }
          }
        }
      }
    });
  }

}
