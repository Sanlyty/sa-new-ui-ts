import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmcGlobalStatisticsComponent } from './emc-global-statistics.component';

describe('EmcGlobalStatisticsComponent', () => {
  let component: EmcGlobalStatisticsComponent;
  let fixture: ComponentFixture<EmcGlobalStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmcGlobalStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmcGlobalStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
