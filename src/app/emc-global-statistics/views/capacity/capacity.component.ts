import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LocalStorageService } from "ngx-store-9";
import { RouteLinkFormatterComponent } from "src/app/common/components/route-link-formatter/route-link-formatter.component";
import { RowTableComponent } from "src/app/common/components/sasi-table/row-table/row-table.component";
import { SelectedRow } from "src/app/common/components/sasi-table/row-table/selected-row";
import {
  SasiSortType,
  SasiTableOptions,
} from "src/app/common/components/sasi-table/sasi-table.component";
import { SimpleSortImpl } from "src/app/common/components/sasi-table/simple-sort-impl";
import { StorageEntityMetricDto } from "src/app/common/models/dtos/storage-entity-metric.dto";
import { AlertRule, Threshold } from "src/app/global-statistics/alert-rule";
import { SimpleFormatterComponent } from "src/app/global-statistics/formatters/simple-formatter/simple-formatter.component";
import { buildCol, quickCol } from "../../tableUtils";

@Component({
  selector: "app-capacity",
  templateUrl: "./capacity.component.html",
  styleUrls: ["./capacity.component.css"],
})
export class CapacityComponent implements OnInit {
  data: StorageEntityMetricDto[] = [];
  options: SasiTableOptions = new SasiTableOptions();
  currentDataCenterId;
  selectedRows: Array<SelectedRow>;

  constructor(
    private route: ActivatedRoute,
    protected localStorageService: LocalStorageService
  ) {
    this.options.rowComponentFormatter = RowTableComponent;
    this.options.labelColumnWidth = "13.78";
    this.options.valueColumnWidth = "13.78";
    this.options.sortService = new SimpleSortImpl();
    this.options.altSortColumnName = "peak";
    this.options.sortColumnNames = ["sortId", "name"];
    this.options.sortType = SasiSortType.ASC;
    this.options.selectableRows = true;
    this.options.storageNamePrefix = "emcCap";

    this.options.columns = [
      quickCol("name", "Name", {
        formatterComponent: RouteLinkFormatterComponent,
        altBorder: true,
      }),
      // Subscribtion
      quickCol("SUBSCRIBED_CAPACITY", "Total (TB)"),
      quickCol("SUBSCRIBED_CAPACITY_PERC", "Physical (%)", {
        altBorder: true,
      }),
      // Physical
      quickCol("PHYSICAL_TOTAL", "Total"),
      quickCol("PHYSICAL_USED", "Used"),
      quickCol("PHYSICAL_FREE", "Free"),
      quickCol("PHYSICAL_USED_PERC", "Used %", { altBorder: true }),
      // NET
      quickCol("NET_TOTAL", "Total"),
      quickCol("NET_USED", "Used"),
      quickCol("NET_FREE", "Free", { altBorder: true }),
      // Savings
      quickCol("COMPRESSION_RATIO", "Comp Ratio", {
        altBorder: true,
      }),
      // Physical Used
      quickCol("PHYSICAL_USED_DAY", "Change 1D"),
      quickCol("PHYSICAL_USED_WEEK", "Change 1W"),
      quickCol("PHYSICAL_USED_MONTH", "Change 1M", { altBorder: true }),
    ].map(buildCol());

    this.options.cellDecoratorRules = [
      new AlertRule("PHYSICAL_USED_PERC", new Threshold("text-red", 88, 10000)),
      new AlertRule(
        "PHYSICAL_USED_PERC",
        new Threshold("text-yellow", 85, 10000)
      ),
      new AlertRule(
        "PHYSICAL_USED_PERC",
        new Threshold("text-green", 80, 10000)
      ),
    ];
    this.options.headerGroups = [
      {
        name: "",
        columns: ["controls"],
      },
      {
        name: "",
        columns: ["name"],
      },
      {
        name: "Subscription",
        columns: ["SUBSCRIBED_CAPACITY", "SUBSCRIBED_CAPACITY_PERC"],
      },
      {
        name: "Physical",
        columns: [
          "PHYSICAL_TOTAL",
          "PHYSICAL_USED",
          "PHYSICAL_FREE",
          "PHYSICAL_USED_PERC",
        ],
      },
      {
        name: "NET",
        columns: ["NET_TOTAL", "NET_USED", "NET_FREE"],
      },
      {
        name: "Savings",
        columns: ["COMPRESSION_RATIO"],
      },
      {
        name: "Physical Used",
        columns: [
          "PHYSICAL_USED_DAY",
          "PHYSICAL_USED_WEEK",
          "PHYSICAL_USED_MONTH",
        ],
      },
    ];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentDataCenterId = Number(params.get("id"));
      this.getTableData();
    });

    this.localStorageService
      .observe(this.options.storageNamePrefix + "_selected")
      .subscribe((data) => {
        this.selectedRows = data.newValue;
      });
  }

  getTableData() {
    fetch(`/api/v2/emc/Capacity`)
      .then((d) => d.json())
      .then((d) => (this.data = d));
  }
}
