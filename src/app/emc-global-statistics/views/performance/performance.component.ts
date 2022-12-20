import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouteLinkFormatterComponent } from "src/app/common/components/route-link-formatter/route-link-formatter.component";
import { RowTableComponent } from "src/app/common/components/sasi-table/row-table/row-table.component";
import {
  SasiColumnBuilder,
  SasiSortType,
  SasiTableOptions,
} from "src/app/common/components/sasi-table/sasi-table.component";
import { SimpleSortImpl } from "src/app/common/components/sasi-table/simple-sort-impl";
import { StorageEntityMetricDto } from "src/app/common/models/dtos/storage-entity-metric.dto";
import { UnitFormatterComponent } from "src/app/global-statistics/formatters/unit-formatter/unit-formatter.component";
import { PeriodType } from "src/app/metric.service";
import { PeriodService } from "src/app/period.service";
import { buildCol, ColDef, quickCol } from "../../tableUtils";

@Component({
  selector: "app-performance",
  templateUrl: "./performance.component.html",
  styleUrls: ["./performance.component.css"],
})
export class PerformanceComponent implements OnInit {
  currentPeriod: PeriodType = PeriodType.WEEK;
  data: StorageEntityMetricDto[] = [];
  options: SasiTableOptions = new SasiTableOptions();
  currentDataCenterId;

  constructor(
    private route: ActivatedRoute,
    private periodService: PeriodService
  ) {
    this.options.rowComponentFormatter = RowTableComponent;
    this.options.labelColumnWidth = "13.78";
    this.options.valueColumnWidth = "13.78";
    this.options.sortService = new SimpleSortImpl();
    this.options.altSortColumnName = "peak";
    this.options.sortColumnNames = ["sortId", "name"];
    this.options.sortType = SasiSortType.ASC;

    this.options.columns = [
      quickCol("name", "Name", {
        formatterComponent: RouteLinkFormatterComponent,
      }),
      quickCol("WORKLOAD", "Workload"),
      quickCol("TRANSFER", "Transfer"),
      quickCol("READ_RESPONSE", "Read Response"),
      quickCol("WRITE_RESPONSE", "Write Response"),
      quickCol("HDD", "HDD"),
      quickCol("CACHE_WP", "Cache WP"),
    ].map(buildCol());
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.currentDataCenterId = Number(params.get("id"));
      this.getTableData();
    });
    this.periodService.periodAnnouncement$.subscribe((period) => {
      if (this.currentPeriod !== period) {
        this.currentPeriod = period;
        this.getTableData();
      }
    });
    this.periodService.announceEnablePeriod(true);
    this.periodService.announcePeriod(this.currentPeriod);
  }

  ngOnDestroy(): void {
    this.periodService.announceEnablePeriod(false);
  }

  getTableData() {
    fetch(`/api/v2/emc/Performance?period=${this.currentPeriod}`)
      .then((d) => d.json())
      .then((d) => (this.data = d));
  }
}
