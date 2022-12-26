import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouteLinkFormatterComponent } from "src/app/common/components/route-link-formatter/route-link-formatter.component";
import { GroupSortAggregateValueImpl } from "src/app/common/components/sasi-table/group-sort-aggregate-value.impl";
import { RowGroupTableComponent } from "src/app/common/components/sasi-table/row-group-table/row-group-table.component";
import { RowTableComponent } from "src/app/common/components/sasi-table/row-table/row-table.component";
import {
  SasiSortType,
  SasiTableOptions,
} from "src/app/common/components/sasi-table/sasi-table.component";
import { SimpleSortImpl } from "src/app/common/components/sasi-table/simple-sort-impl";
import { StorageEntityMetricDto } from "src/app/common/models/dtos/storage-entity-metric.dto";
import { AdapterDisbalanceFormatterComponent } from "src/app/global-statistics/formatters/adapter-disbalance-formatter/adapter-disbalance-formatter.component";
import { AlertFormatterComponent } from "src/app/global-statistics/formatters/alert-formatter/alert-formatter.component";
import { EmptyFormatterComponent } from "src/app/global-statistics/formatters/empty-formatter/empty-formatter.component";
import { SimpleFormatterComponent } from "src/app/global-statistics/formatters/simple-formatter/simple-formatter.component";
import { SumValueServiceImpl } from "src/app/global-statistics/utils/sum-value-service.impl";
import { PeriodType } from "src/app/metric.service";
import { PeriodService } from "src/app/period.service";
import { buildCol, quickCol } from "../../tableUtils";

@Component({
  selector: "app-imbalance",
  templateUrl: "./imbalance.component.html",
  styleUrls: ["./imbalance.component.css"],
})
export class ImbalanceComponent implements OnInit {
  currentPeriod: PeriodType = PeriodType.WEEK;
  data: StorageEntityMetricDto[] = [];
  options: SasiTableOptions = new SasiTableOptions();
  currentDataCenterId;

  constructor(
    private route: ActivatedRoute,
    private periodService: PeriodService
  ) {
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.labelColumnWidth = "23";
    this.options.valueColumnWidth = "36.5";
    this.options.aggregateValuesService = new SumValueServiceImpl();
    this.options.sortService = new GroupSortAggregateValueImpl();
    this.options.sortColumnNames = ["sortId", "name"];

    this.options.columns = [
      quickCol("name", "Name", {
        formatterComponent: EmptyFormatterComponent,
      }),
      quickCol("IMBALANCE_EVENTS", "Host Imbalance", {
        formatterComponent: AdapterDisbalanceFormatterComponent,
        aggComponent: SimpleFormatterComponent,
        isAggregated: true,
      }),
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
    fetch(`/api/v2/emc/Imbalance?period=${this.currentPeriod}`)
      .then((d) => d.json())
      .then((d) => (this.data = d));
  }
}
