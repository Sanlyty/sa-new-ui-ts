import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SaOverviewComponent } from "./sa-overview.component";

describe("OverviewComponent", () => {
  let component: SaOverviewComponent;
  let fixture: ComponentFixture<SaOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
