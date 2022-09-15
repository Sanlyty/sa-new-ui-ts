import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { OverviewView } from "sa-overview-svelte";

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

  constructor(private route: ActivatedRoute) {
    route.paramMap.subscribe((map) => {
      this.system = map.get("system");
      this.view = map.get("view");

      if (this.overviewInstance) {
        this.ngOnInit();
      }
    });
  }

  private overviewInstance: typeof OverviewView;
  ngOnInit(): void {
    // Create Svelte component
    if (this.overviewInstance) {
      this.overviewInstance.$destroy();
    }

    this.overviewInstance = new OverviewView({
      target: this.rootElement.nativeElement,
      props: {
        system: this.system,
        params: {
          board: viewMap[this.view] ?? "dashBoard",
        },
      },
    });
  }

  ngOnDestroy(): void {
    // Dispose Svelte component
    this.overviewInstance?.$destroy();
  }
}
