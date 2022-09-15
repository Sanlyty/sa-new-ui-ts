import { Component, OnInit } from "@angular/core";
import { MenuTree } from "../../common/models/menu-tree.vo";
import { MetricService } from "../../metric.service";
import { MenuItem } from "../../common/models/menu-item.vo";
import { StorageEntityResponseDto } from "../../common/models/dtos/storage-entity-response.dto";
import { SortStorageEntity } from "../../common/utils/sort-storage-entity";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.css"],
})
export class SideMenuComponent implements OnInit {
  constructor(private metricService: MetricService) {
    this.poolMetricLinks = this.poolMetricLinks.flatMap((link) => [
      { ...link, raw: true },
      { ...link, name: link.name + "(Old)" },
    ]);
  }

  items: MenuTree[];
  filteredItems: MenuTree[];
  searchExpression: string;
  poolMetricLinks = [
    { linkPart: "dashboard", name: "Dashboard" },
    { linkPart: "serverBoard", name: "Server board" },
    { linkPart: "dpSla", name: "DP Pool Board and SLA" },
    { linkPart: "deepAnalysis", name: "Deep Analysis" },
    { linkPart: "cache", name: "Cache Board" },
    { linkPart: "adapters", name: "CHA Adapters Board" },
    { linkPart: "trends", name: "Trends" },
    { linkPart: "capacityAnalysis", name: "Capacity Analysis" },
  ];
  globalStatisticsLinks = [];
  storageConfigurationLinks = [];
  sanInfraLinks = [
    {
      id: 1,
      linkPart: `/san-infrastructure/top-talkers`,
      name: "Top Talkers Analysis",
    },
  ];
  private defaultDataCenter: number;

  static convertMenu(data: StorageEntityResponseDto[]): MenuTree[] {
    return SortStorageEntity.sort(data).map(
      (dataCenter) =>
        new MenuTree(
          dataCenter.storageEntity.name,
          dataCenter.storageEntity.children.map(
            (system) => new MenuItem(system.id, system.name)
          )
        )
    );
  }

  ngOnInit() {
    this.metricService.getDataCenters().subscribe((data) => {
      this.items = SideMenuComponent.convertMenu(data);
      this.setDefaultDataCenter(data);
      this.filteredItems = this.items;
    });
  }

  private setDefaultDataCenter(dataCenters: StorageEntityResponseDto[]) {
    if (dataCenters.length > 0) {
      this.defaultDataCenter = dataCenters[0].storageEntity.id;
      this.setGlobalStatisticsLinks();
      this.setSystemConfigurationLinks();
    }
  }

  private setGlobalStatisticsLinks() {
    this.globalStatisticsLinks = [
      {
        linkPart: `/global-statistics/performance`,
        name: "Performance Statistics",
      },
      {
        linkPart: `/global-statistics/physical-capacity`,
        name: "Physical Capacity",
      },
      {
        linkPart: `/global-statistics/logical-capacity`,
        name: "Logical Capacity",
      },
      { linkPart: `/global-statistics/dp-sla`, name: "SLA Events" },
      {
        linkPart: `/global-statistics/adapters`,
        name: "CHA&Port Imbalances",
      },
      {
        linkPart: `/global-statistics/host-group-capacity`,
        name: "VMware Capacity",
      },
      {
        linkPart: `/global-statistics/latency`,
        name: "Latency Analysis",
      },
      {
        linkPart: `/global-statistics/parity-group-events`,
        name: "Parity Group Events",
      },
    ];
  }

  private setSystemConfigurationLinks() {
    this.storageConfigurationLinks = [
      {
        id: 1,
        linkPart: `/storage-config/locations`,
        name: "Systems by locations",
      },
      {
        id: 2,
        linkPart: `/storage-config/port-connectivity`,
        name: "Port connectivity",
      },
    ];
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
        if (item.name.indexOf(this.searchExpression) > -1) {
          if (filteredTree === null) {
            filteredTree = new MenuTree(tree.label, []);
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
