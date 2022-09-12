import { Component, Input, OnInit } from "@angular/core";
import { SystemMetric } from "../../common/models/metrics/system-metric.vo";
import {
  SasiColumn,
  SasiRow,
} from "../../common/components/sasi-table/sasi-table.component";
import { FormBusService } from "../form-bus.service";
import { StorageEntityVo } from "../storage-entity-form/storage-entity-form.component";
import { StorageEntityType } from "../../common/models/dtos/owner.dto";

@Component({
  selector: "app-speed-formatter",
  templateUrl: "./speed-formatter.component.html",
  styleUrls: ["./speed-formatter.component.css"],
})
export class SpeedFormatterComponent implements OnInit {
  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;
  constructor(private formBus: FormBusService) {}

  ngOnInit() {}

  getValue = () => this.data.value;
  getUnit = () => (this.label === "Throughput" ? "Mbps" : "Gbps");

  openForm() {
    const formData = new StorageEntityVo();

    if (this.column === undefined) {
      formData.id = this.data["dbId"];
      formData.name = this.data["value"].toString();
      formData.status = this.data["status"];
      formData.type = StorageEntityType.DATACENTER;
    } else {
      const fields = [
        "type",
        "serialNumber",
        "status",
        "parentId",
        "prefixReferenceId",
        "name",
        "id",
        "dkc",
        "room",
        "rack",
        "arrayModel",
        "managementIp",
        "sortId",
        "speed",
        "note",
        "note",
        "cables",
        "switch",
        "slot",
        "covers",
        "automation",
        "throughput",
        "wwn",
      ];

      fields.forEach((field) => {
        formData[field] = this.rowData.cells[field]?.value;
      });
    }

    this.formBus.sendFormData({ data: formData, selectedData: [] });
  }
}
