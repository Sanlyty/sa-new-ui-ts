import { Component, OnInit } from "@angular/core";
import { MetricService } from "../../../metric.service";
import { SasiWeightedArithmeticMeanUtils } from "../../utils/sasi-weighted-arithmetic-mean.utils";
import { SelectedRow } from "../../../common/components/sasi-table/row-table/selected-row";
import { AggregatedValues } from "../../../common/components/sasi-table/row-group-table/row-group-table.component";
import { SystemPool2SasiGroupTablePipe } from "../../../common/utils/system-pool-2-sasi-group-table.pipe";
import { CommonAggregatedStats } from "../aggregated-statistics/global-physical-capacity-statistics.component";

@Component({
  selector: "app-global-logical-statistics",
  templateUrl: "./grouped-aggregated-statistics.component.html",
  styleUrls: ["./grouped-aggragated-statistics.component.css"],
})
export class GlobalLogicalStatisticsComponent
  extends CommonAggregatedStats
  implements OnInit
{
  data: AggregatedValues = null;
  types = [];
  groupTypes = [0, 1, 2, 3, 4, 5, 6];
  groupLabel = [];

  constructor(
    protected metricService: MetricService,
    protected transformer: SystemPool2SasiGroupTablePipe
  ) {
    super();
    this.typesIntValue = [
      "PHYSICAL_USED",
      "PHYSICAL_CAPACITY",
      "PHYSICAL_FREE",
      "NET_TOTAL",
      "NET_USED",
      "NET_FREE",
      "LOGICAL_CAPACITY",
      "LOGICAL_USED",
      "LOGICAL_FREE",
      "SUBSCRIBED_CAPACITY",
    ];
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

    this.groupLabel.push("Subscribed");
    this.groupLabel.push("Subscription");
    this.groupLabel.push("Utilization");
    this.groupLabel.push("Physical Capacity");
    this.groupLabel.push("Logical Capacity");
    this.groupLabel.push("Net Capacity");
    this.groupLabel.push("Savings");
  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData(): AggregatedValues {
    // TODO duplicated for all GS sasi tables
    this.metricService.getGlobalCapacityStatistics().subscribe(
      (data) => {
        const average = new SasiWeightedArithmeticMeanUtils();
        const filter: SelectedRow[] = [];
        data.forEach((system) =>
          system.children.forEach((pool) => {
            const row = new SelectedRow(system.name, pool.name);
            filter.push(row);
          })
        );
        this.result = average.computeSummaries(
          this.transformer.transform(data, ""),
          filter
        );
        console.log(this.result);
      },
      (error) => {
        console.log(error);
        this.data = null;
      }
    );
    return this.data;
  }

  getGroupLabelByType(type: number): string {
    return this.groupLabel[type] != null ? this.groupLabel[type] : null;
  }
}
