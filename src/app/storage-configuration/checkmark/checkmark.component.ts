import { Component, Input, OnInit } from "@angular/core";
import { SystemMetric } from "../../common/models/metrics/system-metric.vo";
import {
  SasiColumn,
  SasiRow,
} from "../../common/components/sasi-table/sasi-table.component";

@Component({
  selector: "app-checkmark",
  templateUrl: "./checkmark.component.html",
  styleUrls: ["./checkmark.component.css"],
})
export class CheckmarkComponent implements OnInit {
  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;

  constructor() {}

  ngOnInit() {}

  isActive(): boolean | undefined {
    return (this.data.value as any) ?? undefined;
  }
}
