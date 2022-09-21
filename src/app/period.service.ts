import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { PeriodType } from "./metric.service";

@Injectable({
  providedIn: "root",
})
export class PeriodService {
  // Observable string sources
  private periodAnnoucement = new Subject<PeriodType>();
  periodAnnouncement$ = this.periodAnnoucement.asObservable();

  private periodEnableAnnoucement = new Subject<boolean>();
  periodEnableAnnouncement$ = this.periodEnableAnnoucement.asObservable();

  private customEnableAnnoucement = new Subject<boolean>();
  customEnableAnnouncement$ = this.customEnableAnnoucement.asObservable();

  // Service message commands
  announcePeriod(id: PeriodType) {
    this.periodAnnoucement.next(id);
  }

  announceEnablePeriod(enable: boolean) {
    this.periodEnableAnnoucement.next(enable);
    if (!enable) {
      this.announceCustomEnablePeriod(false);
    }
  }

  announceCustomEnablePeriod(enable: boolean) {
    this.customEnableAnnoucement.next(enable);
  }
}
