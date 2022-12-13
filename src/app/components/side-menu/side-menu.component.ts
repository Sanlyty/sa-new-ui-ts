import { Component, OnInit } from "@angular/core";
import feMode from "../../FeMode";

type MainMenuItem = {
  label: string;
  items: SubMenuItem[];
};

type SubMenuItem = {
  label: string;
  link: string;
};

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.css"],
})
export class SideMenuComponent implements OnInit {
  mode = "hp";

  items: MainMenuItem[];
  filteredItems: MainMenuItem[];
  searchExpression: string;
  overviewLinks: Record<string, SubMenuItem[]> = {
    hp: [
      { link: "dashboard", label: "Dashboard" },
      { link: "dpSla", label: "DP Pool Board and SLA" },
      { link: "cache", label: "Cache Board" },
      { link: "adapters", label: "CHB and FE Ports" },
      { link: "trends", label: "Trends" },
    ],
    emc: [
      { link: "emcDashBoard", label: "Dashboard" },
      { link: "emcHostAnalysis", label: "Host Analysis" },
      { link: "emcTrendsBoard", label: "Trends" },
    ],
  };

  mainMenu: Record<string, MainMenuItem[]> = {
    hp: [
      {
        label: "Global Statistics",
        items: [
          {
            link: `/global-statistics/performance`,
            label: "Performance Statistics",
          },
          {
            link: `/global-statistics/physical-capacity`,
            label: "Physical Capacity",
          },
          {
            link: `/global-statistics/logical-capacity`,
            label: "Logical Capacity",
          },
          { link: `/global-statistics/dp-sla`, label: "SLA Events" },
          {
            link: `/global-statistics/adapters`,
            label: "CHB and FE Port Imbalances",
          },
          {
            link: `/global-statistics/host-group-capacity`,
            label: "VMware Capacity",
          },
          {
            link: `/global-statistics/latency`,
            label: "Latency Analysis",
          },
          {
            link: `/global-statistics/parity-group-events`,
            label: "Parity Group Events",
          },
        ],
      },
      {
        label: "Storage Configuration",
        items: [
          {
            label: "Systems by locations",
            link: `/storage-config/locations`,
          },
          {
            label: "Port connectivity",
            link: `/storage-config/port-connectivity`,
          },
        ],
      },
      {
        label: "SAN Infrastructure",
        items: [
          {
            label: "Top Talkers Analysis",
            link: `/san-infrastructure/top-talkers`,
          },
        ],
      },
    ],
    emc: [
      {
        label: "Global Statistics",
        items: [
          {
            label: "Performance Statistics",
            link: "/global-statistics-emc/performance",
          },
          {
            label: "Capacity Statistics",
            link: "/global-statistics-emc/capacity",
          },
          {
            label: "Imbalance Statistics",
            link: "/global-statistics-emc/imbalance",
          },
          {
            label: "VMWare Capacity",
            link: "/global-statistics-emc/vmware",
          },
        ],
      },
    ],
  };

  ngOnInit() {
    feMode.then((fe) => {
      this.mode = fe.mode;
      this.items = Object.entries(fe.map).map(([label, systems]) => ({
        label,
        items: systems.map((label, idx) => ({ label, link: "-" })),
      }));
      this.filteredItems = this.items;
    });
  }

  search(): void {
    if (this.searchExpression === "") {
      this.filteredItems = this.items;
      return;
    }
    let filteredTree = null;
    this.filteredItems = [];
    for (const tree of this.items) {
      for (const item of tree.items) {
        if (item.label.indexOf(this.searchExpression) > -1) {
          if (filteredTree === null) {
            filteredTree = { label: tree.label, items: [] };
          }
          filteredTree.items.push(item);
        }
      }
      if (filteredTree !== null) {
        this.filteredItems.push(filteredTree);
      }
      filteredTree = null;
    }
  }
}
