import { TestBed, inject } from '@angular/core/testing';

import { PlongeurService } from './plongeur.service';

describe('PlongeurService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlongeurService]
    });
  });

  it('should be created', inject([PlongeurService], (service: PlongeurService) => {
    expect(service).toBeTruthy();
  }));
});
