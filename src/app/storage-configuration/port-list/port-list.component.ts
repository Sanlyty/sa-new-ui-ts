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
    const cols: [string, string, Type<any> | undefined][] = [
      ["parentName", "Channel Board", undefined],
      ["name", "Name", undefined],
      ["speed", "Speed", SpeedFormatterComponent],
      ["cables", "Cables", undefined],
      ["switch", "Switch", undefined],
      ["covers", "Covers the room", undefined],
      ["automation", "Automation", CheckmarkComponent],
      ["throughput", "Throughput", SpeedFormatterComponent],
      ["slot", "Slot/Port", undefined],
      ["note", "Description", undefined],
      ["wwn", "WWN", undefined],
      ["status", "Active", StorageEntityStatusComponent],
    ];

    for (const [idx, label, formatter] of cols) {
      this.options.columns.push(
        SasiColumnBuilder.getInstance()
          .withIndex(idx)
          .withLabel(label)
          .withAltLabel(label)
          .withComponent(formatter ?? SeTextFormatterComponent)
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
