import { Component, OnInit } from "@angular/core";
import { MetricService } from "../../../metric.service";
import { Metric } from "../../../common/models/metrics/metric.vo";
import { SystemMetricType } from "../../../common/models/metrics/system-metric-type.enum";
import { SystemPool2SasiGroupTablePipe } from "../../../common/utils/system-pool-2-sasi-group-table.pipe";
import { SasiWeightedArithmeticMeanUtils } from "../../utils/sasi-weighted-arithmetic-mean.utils";
import { SelectedRow } from "../../../common/components/sasi-table/row-table/selected-row";
import { AggregatedValues } from "../../../common/components/sasi-table/row-group-table/row-group-table.component";

export class CommonAggregatedStats {
  result: AggregatedValues;
  aggregatedTypes: SystemMetricType[] = [];
  labels: string[] = [];
  typesIntValue: SystemMetricType[] = [];

  getMetricByType(type: SystemMetricType): Metric {
    if (this.result.getValue(type) !== undefined) {
      return this.result.getValue(type);
    }
    return null;
  }

  getLabelByType(type: string): string {
    return this.labels[type] != null ? this.labels[type] : null;
  }

  toFixed(type, value, position) {
    if (value == null) {
      return "No value";
    }

    if (this.typesIntValue.some((item) => item === type)) {
      return parseFloat(value).toFixed(0);
    }

    return parseFloat(value).toFixed(position);
  }
}

@Component({
  selector: "app-infrastructure-statistics",
  templateUrl: "./aggregated-statistics.component.html",
  styleUrls: ["./aggregated-statistics.component.css"],
})
export class GlobalPhysicalCapacityStatisticsComponent
  extends CommonAggregatedStats
  implements OnInit
{
  constructor(
    protected metricService: MetricService,
    protected transformer: SystemPool2SasiGroupTablePipe
  ) {
    super();
    this.aggregatedTypes = [
      "PHYSICAL_CAPACITY",
      "PHYSICAL_SUBS_PERC",
      "AVAILABLE_CAPACITY",
      "LOGICAL_USED_PERC",
      "PHYSICAL_USED_PERC",
      "TOTAL_SAVING_EFFECT",
      "CHANGE_DAY",
      "CHANGE_WEEK",
      "CHANGE_MONTH",
    ];

    this.typesIntValue = [
      "PHYSICAL_CAPACITY",
      "PHYSICAL_SUBS_PERC",
      "AVAILABLE_CAPACITY",
      "LOGICAL_USED_PERC",
      "PHYSICAL_USED_PERC",
      "CHANGE_DAY",
      "CHANGE_WEEK",
      "CHANGE_MONTH",
    ];

    this.labels["PHYSICAL_CAPACITY"] = "Physical Capacity";
    this.labels["PHYSICAL_SUBS_PERC"] = "Physical Subs";
    this.labels["AVAILABLE_CAPACITY"] = "Available Capacity";
    this.labels["LOGICAL_USED_PERC"] = "Logical Used";
    this.labels["PHYSICAL_USED_PERC"] = "Physical Used";
    this.labels["TOTAL_SAVING_EFFECT"] = "Total Savings";
    this.labels["CHANGE_DAY"] = "Daily Change";
    this.labels["CHANGE_WEEK"] = "Weekly Change";
    this.labels["CHANGE_MONTH"] = "Monthly Change";
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
        this.result = null;
      }
    );
    return this.result;
  }
}
