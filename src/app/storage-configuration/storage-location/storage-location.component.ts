import { Component, OnInit } from "@angular/core";
import { MetricService, PeriodType } from "../../metric.service";
import { StorageEntityResponseDto } from "../../common/models/dtos/storage-entity-response.dto";
import {
  SasiColumnBuilder,
  SasiTableOptions,
} from "../../common/components/sasi-table/sasi-table.component";
import { AlertFormatterComponent } from "../../global-statistics/formatters/alert-formatter/alert-formatter.component";
import { RowGroupTableComponent } from "../../common/components/sasi-table/row-group-table/row-group-table.component";
import { SeTextFormatterComponent } from "../se-text-formatter/se-text-formatter.component";
import { SerialNumberFormatterComponent } from "../serial-number-formatter/serial-number-formatter.component";
import { FormBusService } from "../form-bus.service";
import { StorageEntityVo } from "../storage-entity-form/storage-entity-form.component";
import { GroupSortImpl } from "../../common/components/sasi-table/group-sort-impl";
import { StorageEntityType } from "../../common/models/dtos/owner.dto";
import { ExtractStorageEntityUtils } from "../utils/extract-storage-entity.utils";
import { ComponentStatus } from "../../common/models/dtos/enums/component.status";
import { StorageEntityStatusComponent } from "../storage-entity-status/storage-entity-status.component";

export class SystemData {
  serial: string;
  prefix: string;
  id: number;
  systemName: string;
}

@Component({
  selector: "app-storage-location",
  templateUrl: "./storage-location.component.html",
  styleUrls: ["./storage-location.component.css"],
})
export class StorageLocationComponent implements OnInit {
  data: StorageEntityResponseDto[] = [];
  options: SasiTableOptions = new SasiTableOptions();
  datacenterList = [];
  systemList: SystemData[] = [];
  type = StorageEntityType;
  storageEntityStatuses: ComponentStatus[] = [ComponentStatus.ACTIVE];
  lastDataUpdate = [];

  constructor(
    private metricService: MetricService,
    private formBus: FormBusService
  ) {}

  ngOnInit() {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("name")
        .withAltLabel("Datacenter / System")
        .withLabel("System")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("arrayModel")
        .withLabel("Array Model")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("serialNumber")
        .withLabel("Physical Serial Number")
        .withComponent(SerialNumberFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("dkc")
        .withLabel("Virtual DKCs")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("managementIp")
        .withLabel("Management IP")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("room")
        .withLabel("Room")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("rack")
        .withLabel("Rack")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("sortId")
        .withLabel("Sort ID")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("status")
        .withLabel("Active")
        .withComponent(StorageEntityStatusComponent)
        .withAltSortEnable(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("lastDataUpdate")
        .withLabel("Last Updated")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .build()
    );

    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = SeTextFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.sortService = new GroupSortImpl(true);
    this.options.sortColumnNames = ["sortId", "name"];
    this.loadData();
  }

  getValue(system, property) {
    if (system.detail !== undefined) {
      return system.detail[property];
    }
    return null;
  }

  openForm(type: StorageEntityType) {
    const data = new StorageEntityVo();
    data.type = type;
    this.formBus.sendFormData({ data: data, selectedData: [] });
  }

  toggleStatus() {
    if (this.isActiveOnlyStorageEntities()) {
      this.storageEntityStatuses = [
        ComponentStatus.ACTIVE,
        ComponentStatus.INACTIVE,
      ];
    } else {
      this.storageEntityStatuses = [ComponentStatus.ACTIVE];
    }
    this.loadData(true);
  }

  loadData(force: boolean = true) {
    if (force) {
      this.metricService
        .getStorageEntityDetail(
          StorageEntityType.SYSTEM,
          null,
          this.storageEntityStatuses
        )
        .subscribe((data) => {
          this.metricService
            .getPerformanceStatistics(-1, PeriodType.DAY)
            .subscribe((capacityData) => {
              capacityData.forEach((dc) =>
                dc.children.forEach((system) => {
                  this.lastDataUpdate[system.id] = system.metrics.filter(
                    (metric) => metric.type === "WORKLOAD"
                  )[0].date;
                })
              );
              this.data = data;
              this.systemList = ExtractStorageEntityUtils.extractByType(
                data,
                StorageEntityType.SYSTEM
              );
              this.datacenterList = this.data.map(
                (datacenter) => datacenter.storageEntity
              );
            });
        });
    }
  }

  isActiveOnlyStorageEntities() {
    return this.storageEntityStatuses.every(
      (item) => item === ComponentStatus.ACTIVE
    );
  }
}
