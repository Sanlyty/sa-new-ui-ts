import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OverviewView } from "sa-overview-svelte";
import { PeriodType } from "../metric.service";
import { PeriodService } from "../period.service";

const viewMap = {
  dashboard: "dashBoard",
  cache: "cacheBoard",
  channel: "channelBoard",
  trends: "trendsBoard",
};

@Component({
  selector: "app-sa-overview",
  templateUrl: "./sa-overview.component.html",
  styleUrls: ["./sa-overview.component.css"],
})
export class SaOverviewComponent implements OnInit, OnDestroy {
  public system: string = "";
  public view: string = "";

  @ViewChild("root", { static: true }) rootElement: ElementRef;

  constructor(
    private route: ActivatedRoute,
    protected periodService: PeriodService
  ) {
    route.paramMap.subscribe((map) => {
      this.system = map.get("system");
      this.view = map.get("view");

      if (this.overviewInstance) {
        this.activateSvelteComponent();
      }
    });
  }

  private overviewInstance: typeof OverviewView;
  ngOnInit(): void {
    this.periodService.announceEnablePeriod(true);
    this.periodService.announceCustomEnablePeriod(true);
    this.activateSvelteComponent();

    this.periodService.periodAnnouncement$.subscribe((period) => {
      this.overviewInstance.$set({ period: period.toLowerCase() });
    });
  }

  activateSvelteComponent() {
    this.periodService.announcePeriod(PeriodType.WEEK);

    // Remove previous
    if (this.overviewInstance) {
      this.overviewInstance.$destroy();
    }

    this.overviewInstance = new OverviewView({
      target: this.rootElement.nativeElement,
      props: {
        period: "week",
        system: this.system,
        params: {
          board: viewMap[this.view] ?? "dashBoard",
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
  }
}
