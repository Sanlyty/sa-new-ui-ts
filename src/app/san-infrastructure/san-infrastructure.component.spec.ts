import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SanInfrastructureComponent} from './san-infrastructure.component';

describe('SanInfrastructureComponent', () => {
  let component: SanInfrastructureComponent;
  let fixture: ComponentFixture<SanInfrastructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SanInfrastructureComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
