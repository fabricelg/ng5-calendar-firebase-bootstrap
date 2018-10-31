import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlongeurComponent } from './plongeur.component';

describe('PlongeurComponent', () => {
  let component: PlongeurComponent;
  let fixture: ComponentFixture<PlongeurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlongeurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlongeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
