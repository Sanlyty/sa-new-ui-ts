import { Component, OnInit } from "@angular/core";
import { MetricService, PeriodType } from "../../../metric.service";
import {
  SasiColumnBuilder,
  SasiTableOptions,
} from "../../../common/components/sasi-table/sasi-table.component";
import { StorageEntityMetricDto } from "../../../common/models/dtos/storage-entity-metric.dto";
import { ActivatedRoute, Router } from "@angular/router";
import { PeriodService } from "../../../period.service";
import { RouteLinkFormatterComponent } from "../../../common/components/route-link-formatter/route-link-formatter.component";
import { SeTextFormatterComponent } from "../../../storage-configuration/se-text-formatter/se-text-formatter.component";
import { AlertFormatterComponent } from "../../formatters/alert-formatter/alert-formatter.component";
import { RowGroupTableComponent } from "../../../common/components/sasi-table/row-group-table/row-group-table.component";
import { MetricHandlerUtils } from "../../utils/metric-handler.utils";
import { TimestampToDateComponent } from "../../formatters/timestamp-to-date/timestamp-to-date.component";
import { TimeIntervalFormatterComponent } from "../../formatters/time-interval-formatter/time-interval-formatter.component";
import { DurationFormatterComponent } from "../../formatters/duration-formatter/duration-formatter.component";
import { UnitFormatterComponent } from "../../formatters/unit-formatter/unit-formatter.component";
import { GroupSortImpl } from "../../../common/components/sasi-table/group-sort-impl";

@Component({
  selector: "app-parity-group-events",
  templateUrl: "./parity-group-events.component.html",
  styleUrls: ["./parity-group-events.component.css"],
})
export class ParityGroupEventsComponent implements OnInit {
  currentPeriod: PeriodType = PeriodType.WEEK;

  options: SasiTableOptions = new SasiTableOptions();

  data: StorageEntityMetricDto[] = []; // TODO duplicated in all Global statistics - grouped
  currentDataCenterId; // TODO duplicated iin all Global statistics

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected periodService: PeriodService,
    protected metricService: MetricService
  ) {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("name")
        .withLabel("Parity Group")
        .withComponent(RouteLinkFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("poolName")
        .withLabel("Pool Name")
        .withComponent(RouteLinkFormatterComponent)
        .withColumnTooltipText("DP Pool where Parity Group is used")
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("HDD_PERC")
        .withLabel("Utilization")
        .withColumnTooltipText(
          "Average/Peak value of the Parity Group utilization within event time interval"
        )
        .withComponent(UnitFormatterComponent)
        .withAltSortEnable(true)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("date")
        .withLabel("Date")
        .withColumnTooltipText("Date of event when threshold was breached")
        .withComponent(TimestampToDateComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("timeInterval")
        .withLabel("Time")
        .withColumnTooltipText("Time interval when treshold was breached")
        .withComponent(TimeIntervalFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("DURATION")
        .withLabel("Duration")
        .withColumnTooltipText("Duration of the event")
        .withComponent(DurationFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("sortId")
        .withLabel("Sort ID")
        .withComponent(SeTextFormatterComponent)
        .withAltSortEnable(false)
        .withHidden(true)
        .build()
    );
    this.options.colControlFormatter = AlertFormatterComponent;
    this.options.rowComponentFormatter = RowGroupTableComponent;
    this.options.grIndexComponentFormatter = RouteLinkFormatterComponent;
    this.options.isDataGrouped = true;
    this.options.highlightRow = true;
    this.options.highlightColumn = false;
    this.options.labelColumnWidth = "25";
    this.options.valueColumnWidth = "35.75";
    // this.options.aggregateValuesService = new SumValueServiceImpl();
    this.options.sortService = new GroupSortImpl();
    this.options.altSortColumnName = "peak";
    this.options.sortColumnNames = ["sortId", "name"];
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get("id");
      this.getTableData(id); // TODO initInternal removed, check collapse/select behavior
    });
    this.periodService.periodAnnouncement$.subscribe((period) => {
      if (this.currentPeriod !== period) {
        this.currentPeriod = period;
        this.getTableData(this.currentDataCenterId);
      }
    });
    this.periodService.announceEnablePeriod(true);
    this.periodService.announcePeriod(this.currentPeriod);
  }

  ngOnDestroy(): void {
    this.periodService.announceEnablePeriod(false);
  }

  getTableData(id: number): StorageEntityMetricDto[] {
    // TODO duplicated for all GS sasi tables
    this.currentDataCenterId = id;
    this.metricService.getParityGroupEvents(id, this.currentPeriod).subscribe(
      (data) => (this.data = MetricHandlerUtils.success(data)),
      (error) => (this.data = MetricHandlerUtils.error(error))
    );
    return this.data;
  }
}
