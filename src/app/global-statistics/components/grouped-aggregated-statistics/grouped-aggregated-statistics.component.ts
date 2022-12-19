import { Component, Input, OnInit } from "@angular/core";
import { SasiGroupRow } from "../../../common/components/sasi-table/sasi-table.component";
import { LocalStorageService } from "ngx-store-9";
import { SasiWeightedArithmeticMeanUtils } from "../../utils/sasi-weighted-arithmetic-mean.utils";
import { SelectedRow } from "../../../common/components/sasi-table/row-table/selected-row";
import { SystemMetricType } from "../../../common/models/metrics/system-metric-type.enum";
import { CommonAggregatedStats } from "../aggregated-statistics/global-physical-capacity-statistics.component";

@Component({
  selector: "app-grouped-aggregated-statistics",
  templateUrl: "./grouped-aggregated-statistics.component.html",
  styleUrls: ["./grouped-aggragated-statistics.component.css"],
})
export class GroupedAggregatedStatisticsComponent
  extends CommonAggregatedStats
  implements OnInit
{
  @Input() data: SasiGroupRow[];
  @Input() prefix: string;
  @Input() selectedRows: Array<SelectedRow>;
  typesIntValue: SystemMetricType[];
  types = [];
  groupTypes = [0, 1, 2, 3, 4, 5, 6, 7];
  groupLabel = [];

  constructor(private localStorageService: LocalStorageService) {
    super();
    this.typesIntValue = [
      "SELECTED_COUNT",
      "SUBSCRIBED_CAPACITY",
      "PHYSICAL_SUBS_PERC",
      "LOGICAL_SUBS_PERC",
      "NET_SUBS_PERC",
      "PHYSICAL_USED_PERC",
      "LOGICAL_USED_PERC",
      "NET_USED_PERC",
      "PHYSICAL_CAPACITY",
      "PHYSICAL_USED",
      "PHYSICAL_FREE",
      "LOGICAL_CAPACITY",
      "LOGICAL_USED",
      "LOGICAL_FREE",
      "NET_TOTAL",
      "NET_USED",
      "NET_FREE",
    ];
    this.types.push(["SELECTED_COUNT"]);
    this.types.push(["SUBSCRIBED_CAPACITY"]);
    this.types.push([
      "PHYSICAL_SUBS_PERC",
      "LOGICAL_SUBS_PERC",
      "NET_SUBS_PERC",
    ]);
    this.types.push([
      "PHYSICAL_USED_PERC",
      "LOGICAL_USED_PERC",
      "NET_USED_PERC",
    ]);
    this.types.push(["PHYSICAL_CAPACITY", "PHYSICAL_USED", "PHYSICAL_FREE"]);
    this.types.push(["LOGICAL_CAPACITY", "LOGICAL_USED", "LOGICAL_FREE"]);
    this.types.push(["NET_TOTAL", "NET_USED", "NET_FREE"]);
    this.types.push([
      "COMPRESSION_RATIO",
      "DEDUP_RATIO",
      "TOTAL_SAVING_EFFECT",
    ]);

    this.labels["PHYSICAL_SUBS_PERC"] = "Physical";
    this.labels["LOGICAL_SUBS_PERC"] = "Logical";
    this.labels["NET_SUBS_PERC"] = "Net";
    this.labels["PHYSICAL_USED_PERC"] = "Physical";
    this.labels["LOGICAL_USED_PERC"] = "Logical";
    this.labels["NET_USED_PERC"] = "Net";
    this.labels["PHYSICAL_CAPACITY"] = "Capacity";
    this.labels["PHYSICAL_USED"] = "Used";
    this.labels["PHYSICAL_FREE"] = "Free";
    this.labels["LOGICAL_CAPACITY"] = "Capacity";
    this.labels["LOGICAL_USED"] = "Used";
    this.labels["LOGICAL_FREE"] = "Free";
    this.labels["NET_TOTAL"] = "Capacity";
    this.labels["NET_USED"] = "Used";
    this.labels["NET_FREE"] = "Free";
    this.labels["COMPRESSION_RATIO"] = "Comp";
    this.labels["DEDUP_RATIO"] = "Dedup";
    this.labels["TOTAL_SAVING_EFFECT"] = "Savings";

    this.groupLabel.push("# Selected");
    this.groupLabel.push("Subscribed");
    this.groupLabel.push("Subscription");
    this.groupLabel.push("Utilization");
    this.groupLabel.push("Physical Capacity");
    this.groupLabel.push("Logical Capacity");
    this.groupLabel.push("Net Capacity");
    this.groupLabel.push("Savings");
  }

  ngOnInit() {
    this.aggregate();
    this.localStorageService
      .observe(this.prefix + "_selected")
      .subscribe((data) => {
        this.selectedRows = data.newValue;
        this.aggregate();
      });
  }

  aggregate() {
    this.selectedRows = this.localStorageService.get(this.prefix + "_selected");
    if (this.selectedRows === null) {
      this.selectedRows = [];
    }
    const mean = new SasiWeightedArithmeticMeanUtils();
    this.result = mean.computeSummaries(this.data, this.selectedRows);
  }

  getGroupLabelByType(type: number): string {
    return this.groupLabel[type] != null ? this.groupLabel[type] : null;
  }
}
