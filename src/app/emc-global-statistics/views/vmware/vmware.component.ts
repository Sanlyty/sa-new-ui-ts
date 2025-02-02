import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import {
  SasiSortType,
  SasiTableOptions,
} from "src/app/common/components/sasi-table/sasi-table.component";
import { StorageEntityMetricDto } from "src/app/common/models/dtos/storage-entity-metric.dto";
import { buildCol, quickCol } from "../../tableUtils";
import { RouteLinkFormatterComponent } from "src/app/common/components/route-link-formatter/route-link-formatter.component";
import { RowGroupTableComponent } from "src/app/common/components/sasi-table/row-group-table/row-group-table.component";
import { GroupSortImpl } from "src/app/common/components/sasi-table/group-sort-impl";
import { SimpleFormatterComponent } from "src/app/global-statistics/formatters/simple-formatter/simple-formatter.component";
import { SasiWeightedArithmeticMeanUtils } from "src/app/global-statistics/utils/sasi-weighted-arithmetic-mean.utils";
import { LocalStorageService } from "ngx-store-9";

@Component({
  selector: "app-vmware",
  templateUrl: "./vmware.component.html",
  styleUrls: ["./vmware.component.css"],
})
export class VmwareComponent implements OnInit {
  data: StorageEntityMetricDto[] = [];
  options: SasiTableOptions = new SasiTableOptions();
  currentDataCenterId;

  constructor(
    private route: ActivatedRoute,
    protected localStorageService: LocalStorageService
  ) {
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.sortService = new GroupSortImpl();
    this.options.aggregateValuesService = new SasiWeightedArithmeticMeanUtils();
    this.options.sortColumnNames = ["name"];
    this.options.storageNamePrefix = "emcVMware";
    this.options.sortType = SasiSortType.ASC;
    this.options.isDataGrouped = true;
    this.options.selectableRows = true;
    this.options.groupLabelAlign = "left";

    this.options.columns = [
      quickCol("name", "Host", {
        altLabel: "System",
        formatterComponent: RouteLinkFormatterComponent,
        isAggregated: false,
      }),
      quickCol("PROVISIONED", "Provisioned Capacity", {
        isAggregated: true,
        aggComponent: SimpleFormatterComponent,
      }),
      quickCol("USED", "Used Capacity", { isAggregated: true }),
      quickCol("USED_PERC", "Used Ratio", { isAggregated: true }),
      quickCol("LUN_COUNT", "LUNs Count", { isAggregated: true }),
      quickCol("USED_DAY", "Change Day", { isAggregated: true }),
      quickCol("USED_WEEK", "Change Week", { isAggregated: true }),
      quickCol("USED_MONTH", "Change Month", { isAggregated: true }),
    ].map(buildCol({ formatter: SimpleFormatterComponent }));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentDataCenterId = Number(params.get("id"));
      this.getTableData();
    });
  }

  getTableData() {
    fetch(`/api/v2/emc/VMware`)
      .then((d) => d.json())
      .then((d) => (this.data = d));
  }
}
