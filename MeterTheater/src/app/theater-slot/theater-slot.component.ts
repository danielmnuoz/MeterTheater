import { Component, OnInit, Input } from '@angular/core';
import { Socket } from '../socket';

@Component({
  selector: 'app-theater-slot',
  templateUrl: './theater-slot.component.html',
  styleUrls: ['./theater-slot.component.css']
})
export class TheaterSlotComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() socket?: Socket;

}
