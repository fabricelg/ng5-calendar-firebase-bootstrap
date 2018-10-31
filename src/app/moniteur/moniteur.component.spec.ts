import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoniteurComponent } from './moniteur.component';

describe('MoniteurComponent', () => {
  let component: MoniteurComponent;
  let fixture: ComponentFixture<MoniteurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoniteurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoniteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
