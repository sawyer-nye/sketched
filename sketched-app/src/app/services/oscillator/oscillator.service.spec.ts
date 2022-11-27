import { TestBed } from '@angular/core/testing';
import { OscillatorService } from './oscillator.service';


describe('OscillatorService', () => {
  let service: OscillatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OscillatorService);
  });

  it('should be created', () => {1
    expect(service).toBeTruthy();
  });
});
