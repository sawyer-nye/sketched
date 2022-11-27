import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OscillatorViewComponent } from './oscillator-view.component';

describe('OscillatorViewComponent', () => {
  let component: OscillatorViewComponent;
  let fixture: ComponentFixture<OscillatorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OscillatorViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OscillatorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
