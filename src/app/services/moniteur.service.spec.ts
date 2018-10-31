import { TestBed, inject } from '@angular/core/testing';

import { MoniteurService } from './moniteur.service';

describe('MoniteurService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoniteurService]
    });
  });

  it('should be created', inject([MoniteurService], (service: MoniteurService) => {
    expect(service).toBeTruthy();
  }));
});
