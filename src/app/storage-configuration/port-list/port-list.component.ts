import { Component, Type } from "@angular/core";
import { StorageEntityType } from "../../common/models/dtos/owner.dto";
import { SasiColumnBuilder } from "../../common/components/sasi-table/sasi-table.component";
import { MetricService } from "../../metric.service";
import { FormBusService } from "../form-bus.service";
import { SeTextFormatterComponent } from "../se-text-formatter/se-text-formatter.component";
import { RowTableComponent } from "../../common/components/sasi-table/row-table/row-table.component";
import { SimpleSortImpl } from "../../common/components/sasi-table/simple-sort-impl";
import { StorageEntityList } from "../channel-board-list/channel-board-list.component";
import { SpeedFormatterComponent } from "../speed-formatter/speed-formatter.component";
import { StorageEntityStatusComponent } from "../storage-entity-status/storage-entity-status.component";
import { CheckmarkComponent } from "../checkmark/checkmark.component";

@Component({
  selector: "app-port-list",
  templateUrl: "../channel-board-list/channel-board-list.component.html",
  styleUrls: ["../channel-board-list/channel-board-list.component.css"],
})
export class PortListComponent extends StorageEntityList {
  constructor(
    protected metricService: MetricService,
    protected formBus: FormBusService
  ) {
    super(metricService, formBus, StorageEntityType.PORT);
  }

  ngOnInit() {
    // Index, Label, Formatter?, ColumnTooltip?
    const cols: [string, string, Type<any>?, string?][] = [
      ["name", "Name"],
      ["parentName", "Channel Board"],
      ["speed", "Speed", SpeedFormatterComponent],
      ["cables", "Cables"],
      ["switch", "Switch"],
      ["slot", "Slot/Port"],
      ["note", "Description"],
      ["covers", "Covers the room"],
      [
        "throughput",
        "Throughput",
        SpeedFormatterComponent,
        "Weekly Average Throughput for particular FE port",
      ],
      ["wwn", "WWN"],
      [
        "automation",
        "Automation",
        CheckmarkComponent,
        "Define if FE port is available for automation",
      ],
      ["status", "Active", StorageEntityStatusComponent],
    ];

    for (const [idx, label, formatter, tt] of cols) {
      this.options.columns.push(
        SasiColumnBuilder.getInstance()
          .withIndex(idx)
          .withLabel(label)
          .withAltLabel(label)
          .withComponent(formatter ?? SeTextFormatterComponent)
          .withColumnTooltipText(tt ?? label)
          .build()
      );
    }

    this.options.rowComponentFormatter = RowTableComponent;
    // this.options.grIndexComponentFormatter = SpeedFormatterComponent;
    this.options.isDataGrouped = false;
    this.options.selectableRows = true;
    this.options.storeSelectedRows = false;
    this.options.storageNamePrefix = "portList";
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.sortService = new SimpleSortImpl();
    this.options.sortColumnNames = ["name"];
  }
}
