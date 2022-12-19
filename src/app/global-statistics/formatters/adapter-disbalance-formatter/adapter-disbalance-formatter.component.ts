import { Component, Input, OnInit } from "@angular/core";
import { SystemMetric } from "../../../common/models/metrics/system-metric.vo";
import {
  SasiColumn,
  SasiRow,
} from "../../../common/components/sasi-table/sasi-table.component";
import { SystemMetricType } from "../../../common/models/metrics/system-metric-type.enum";
import { UnitFormatterComponent } from "../unit-formatter/unit-formatter.component";

@Component({
  selector: "app-adapter-disbalance-formatter",
  templateUrl: "./adapter-disbalance-formatter.component.html",
  styleUrls: ["./adapter-disbalance-formatter.component.css"],
})
export class AdapterDisbalanceFormatterComponent
  extends UnitFormatterComponent
  implements OnInit
{
  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;
  @Input() isPortMetric = false;

  private absolutType: SystemMetricType = "IMBALANCE_ABSOLUT";
  private percType: SystemMetricType = "IMBALANCE_PERC";
  private eventsType: SystemMetricType = "IMBALANCE_EVENTS";

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.isPortMetric) {
      console.log(this.data);
      this.absolutType = "PORT_IMBALANCE_ABSOLUT";
      this.percType = "PORT_IMBALANCE_PERC";
      this.eventsType = "PORT_IMBALANCE_EVENTS";
    }
  }

  getInfoMessage() {
    return `(${this.resolveAbsoluteDisbalance()} [MB/s] -> ${this.data.value}%`;
  }

  private resolveAbsoluteDisbalance() {
    return this.resolveDisbalance(this.absolutType);
  }

  private resolveRelativeDisbalance() {
    return this.resolveDisbalance(this.percType);
  }

  private resolveDisbalance(type: SystemMetricType): string {
    if (this.rowData !== undefined && this.rowData.getCell(type) != null) {
      return this.rowData.getCell(type).value;
    }
  }

  private isVisible() {
    if (
      this.rowData !== undefined &&
      parseInt(this.rowData.getCell(this.eventsType).value, 10) > 0
    ) {
      return true;
    }
    return false;
  }

  private getName() {
    return this.rowData.getCell("name").value;
  }
}
