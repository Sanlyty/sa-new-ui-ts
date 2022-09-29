import { Component, OnInit } from "@angular/core";
import { PeriodType } from "../../metric.service";
import { PeriodService } from "../../period.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  animations: [
    trigger("openClose", [
      state(
        "true",
        style({
          // display: 'block'
          transform: "translateY(0)",
        })
      ),
      state(
        "false",
        style({
          // display: 'none',
          transform: "translateY(-100%)",
        })
      ),
      transition("true => *", [animate("0.3s")]),
      transition("false => *", [animate("0.3s")]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  enable = false;
  customEnabled = false;
  logoUrl = environment.logoUrl;
  periodType = PeriodType;

  public currentPeriod: PeriodType = PeriodType.WEEK;

  constructor(private periodService: PeriodService) {}

  ngOnInit() {
    this.periodService.periodEnableAnnouncement$.subscribe(
      (value) => (this.enable = value)
    );
    this.periodService.periodAnnouncement$.subscribe(
      (value) => (this.currentPeriod = value)
    );

    this.periodService.customEnableAnnouncement$.subscribe(
      (value) => (this.customEnabled = value)
    );
  }

  setCurrentPeriod(period: PeriodType) {
    this.currentPeriod = period;
    this.periodService.announcePeriod(period);
  }

  isCurrentPeriod(period: PeriodType) {
    return period === this.currentPeriod;
  }

  isCustomEnabled() {
    return this.customEnabled;
  }

  onAnimationEvent(event: AnimationEvent) {
    this.periodService.announcePeriod(this.currentPeriod);
  }
}
