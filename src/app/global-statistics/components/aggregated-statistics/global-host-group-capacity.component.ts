import { Component, OnInit } from "@angular/core";
import { AggregatedValues } from "../../../common/components/sasi-table/row-group-table/row-group-table.component";
import { MetricService } from "../../../metric.service";
import { SystemPool2SasiGroupTablePipe } from "../../../common/utils/system-pool-2-sasi-group-table.pipe";
import { SasiWeightedArithmeticMeanUtils } from "../../utils/sasi-weighted-arithmetic-mean.utils";
import { SelectedRow } from "../../../common/components/sasi-table/row-table/selected-row";
import { CommonAggregatedStats } from "./global-physical-capacity-statistics.component";

@Component({
  selector: "app-global-host-group-capacity",
  templateUrl: "./aggregated-statistics.component.html",
  styleUrls: ["./aggregated-statistics.component.css"],
})
export class GlobalHostGroupCapacityComponent
  extends CommonAggregatedStats
  implements OnInit
{
  constructor(
    protected metricService: MetricService,
    protected transformer: SystemPool2SasiGroupTablePipe
  ) {
    super();
    this.aggregatedTypes = [
      "NET_TOTAL",
      "NET_USED",
      "NET_USED_PERC",
      "CHANGE_DAY",
      "CHANGE_WEEK",
      "CHANGE_MONTH",
    ];

    this.labels["NET_TOTAL"] = "Provisioned Capacity";
    this.labels["NET_USED"] = "Used Capacity";
    this.labels["NET_USED_PERC"] = "Used Capacity";
    this.labels["CHANGE_DAY"] = "Last Day Change";
    this.labels["CHANGE_WEEK"] = "Last Week Change";
    this.labels["CHANGE_MONTH"] = "Last Month Change";
  }

  ngOnInit() {
    this.getTableData();
  }

  getTableData(): AggregatedValues {
    // TODO duplicated for all GS sasi tables
    this.metricService.getGlobalHostGroupCapacityStatistics().subscribe(
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
