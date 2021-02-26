import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTalkersComponent } from './top-talkers.component';

describe('TopTalkersComponent', () => {
  let component: TopTalkersComponent;
  let fixture: ComponentFixture<TopTalkersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopTalkersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopTalkersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
