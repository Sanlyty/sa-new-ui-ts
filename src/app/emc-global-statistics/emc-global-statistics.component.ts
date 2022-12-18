import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-emc-global-statistics",
  templateUrl: "./emc-global-statistics.component.html",
  styleUrls: ["./emc-global-statistics.component.css"],
})
export class EmcGlobalStatisticsComponent implements OnInit {
  title: string = "Statistics";

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.infoFromRoute();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) this.infoFromRoute();
    });
  }

  infoFromRoute() {
    const data = this.route.firstChild.snapshot.data;

    this.title = data.title ?? data.breadcrumb ?? "Statistics";
  }

  getTitle() {
    return this.title;
  }

  getTabTitle() {
    return undefined;
    // return tabTitles[this.context];
  }
}
