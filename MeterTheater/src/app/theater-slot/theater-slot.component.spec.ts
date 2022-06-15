import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterSlotComponent } from './theater-slot.component';

describe('TheaterSlotComponent', () => {
  let component: TheaterSlotComponent;
  let fixture: ComponentFixture<TheaterSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheaterSlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TheaterSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
