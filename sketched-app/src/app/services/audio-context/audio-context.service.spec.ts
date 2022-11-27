import { TestBed } from '@angular/core/testing';

import { AudioContextService } from './audio-context.service';

describe('OscillatorService', () => {
  let service: AudioContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioContextService);
  });

  it('should be created', () => {1
    expect(service).toBeTruthy();
  });
});
