import { Component, Input, OnInit } from '@angular/core';
import { Socket } from '../socket'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() socket?: Socket;

}
