import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetErrorComponent } from './net-error.component';

describe('NetErrorComponent', () => {
  let component: NetErrorComponent;
  let fixture: ComponentFixture<NetErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
