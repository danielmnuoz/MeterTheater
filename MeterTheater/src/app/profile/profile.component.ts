import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Meter } from '../meter';
import { Socket } from '../socket'
import { SocketService } from '../socket.service';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges {

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.ownedSockets$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.socketService.searchSockets(term)),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.search(this.owner);
  }

  @Input() owner: string = '';
  ownedSockets$!: Observable<Socket[]>;
  private searchTerms = new Subject<string>();

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

}
