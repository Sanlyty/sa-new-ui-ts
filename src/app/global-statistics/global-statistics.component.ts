import { Component, OnInit } from "@angular/core";
import { Datacenter, datacenterOf } from "../common/models/datacenter.vo";
import { MetricService } from "../metric.service";
import { SortStorageEntity } from "../common/utils/sort-storage-entity";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-global-statistics",
  templateUrl: "./global-statistics.component.html",
  styleUrls: ["./global-statistics.component.css"],
})
export class GlobalStatisticsComponent implements OnInit {
  dataCenters: Datacenter[] = [];
  currentTab: number;

  constructor(
    private metricService: MetricService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.metricService.getDataCenters().subscribe((data) => {
      this.dataCenters = [
        // The default datacenter
        {
          id: -1,
          label: "All",
        },
        ...SortStorageEntity.sort(data).map(datacenterOf),
      ];
    });

    this.infoFromRoute();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.infoFromRoute();
    });
  }

  activeTab(id: number) {
    this.currentTab = id;
  }

  isCurrentTab(id: number): boolean {
    return id === this.currentTab;
  }

  infoFromRoute() {
    const data = this.route.firstChild.snapshot.data;
    this.currentTab =
      Number(this.route.firstChild.snapshot.paramMap.get("id")) ?? -1;
    this.title = data.title ?? data.breadcrumb ?? "Statistics";
    this.tabTitle = data.tabTitle;
    this.context = this.route.firstChild.snapshot.url[0]?.path;
  }

  private context = "-";
  private title = "Statistics";
  getTitle() {
    return this.title;
  }

  private tabTitle: string | undefined = undefined;
  getTabTitle() {
    return this.tabTitle;
  }
}
