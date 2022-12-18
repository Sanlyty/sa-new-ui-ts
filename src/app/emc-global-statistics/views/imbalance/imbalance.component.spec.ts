import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImbalanceComponent } from './imbalance.component';

describe('ImbalanceComponent', () => {
  let component: ImbalanceComponent;
  let fixture: ComponentFixture<ImbalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImbalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImbalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
