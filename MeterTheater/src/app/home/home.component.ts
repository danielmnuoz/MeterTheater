import { Component, OnInit } from '@angular/core';
import { Socket } from '../socket'
import { Meter } from '../meter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    
  ) { }

  ngOnInit(): void {
    
  }

  selectedSocket?: Socket;
  selectedMeter?: Meter;

  selectSocket(socket?: Socket){
    this.selectedSocket = socket;
  }

  selectMeter(meter?: Meter){
    this.selectedMeter = meter;
  }

}
