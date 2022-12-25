import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { OverviewView } from "sa-overview-svelte";
import { PeriodType } from "../metric.service";
import { PeriodService } from "../period.service";

const viewMap = {
  dashboard: "dashBoard",
  cache: "cacheBoard",
  adapters: "channelBoard",
  trends: "trendsBoard",
  dpSla: "dpPoolBoard",
};

const withoutTime: string[] = ["trends", "emcTrendsBoard"];

@Component({
  selector: "app-sa-overview",
  templateUrl: "./sa-overview.component.html",
  styleUrls: ["./sa-overview.component.css"],
})
export class SaOverviewComponent implements OnInit, OnDestroy {
  public system: string = "";
  public view: string = "";

  @ViewChild("root", { static: true }) rootElement: ElementRef;

  private routeSub: Subscription;
  private periodSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    protected periodService: PeriodService
  ) {
    this.routeSub = this.route.paramMap.subscribe((map) => {
      this.system = map.get("system");
      this.view = map.get("view");

      if (this.overviewInstance) {
        this.activateSvelteComponent();
      }
    });
  }

  private overviewInstance: OverviewView;
  ngOnInit(): void {
    this.periodService.announceCustomEnablePeriod(true);
    this.activateSvelteComponent();

    this.periodSub = this.periodService.periodAnnouncement$.subscribe(
      (period) => {
        this.overviewInstance.$set({ period: period.toLowerCase() });
      }
    );
  }

  activateSvelteComponent() {
    this.periodService.announceEnablePeriod(!withoutTime.includes(this.view));
    this.periodService.announcePeriod(PeriodType.WEEK);

    // Remove previous
    this.overviewInstance?.$destroy();

    this.overviewInstance = new OverviewView({
      target: this.rootElement.nativeElement,
      props: {
        period: "week",
        system: this.system,
        params: {
          board: viewMap[this.view] ?? this.view,
        },
      },
    });

    this.overviewInstance.$on(
      "optionChanged",
      (e: { detail: { option: string } }) => {
        if (e.detail.option === "custom") {
          this.periodService.announcePeriod(PeriodType.CUSTOM);
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Dispose Svelte component
    this.periodService.announceEnablePeriod(false);
    this.overviewInstance?.$destroy();
    this.routeSub.unsubscribe();
    this.periodSub?.unsubscribe();
  }
}
