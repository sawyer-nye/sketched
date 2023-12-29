import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthViewComponent } from './synth-view.component';

describe('OscillatorViewComponent', () => {
  let component: SynthViewComponent;
  let fixture: ComponentFixture<SynthViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SynthViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SynthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
