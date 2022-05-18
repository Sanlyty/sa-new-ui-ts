import { Component, OnDestroy, OnInit } from "@angular/core";
import { MetricService, PeriodType } from "../../../metric.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SystemMetricType } from "../../../common/models/metrics/system-metric-type.enum";
import { PeriodService } from "../../../period.service";
import { BusService } from "../../bus.service";
import {
  SasiColumnBuilder,
  SasiSortType,
  SasiTableOptions,
} from "../../../common/components/sasi-table/sasi-table.component";
import { UnitFormatterComponent } from "../../formatters/unit-formatter/unit-formatter.component";
import { RouteLinkFormatterComponent } from "../../../common/components/route-link-formatter/route-link-formatter.component";
import { AlertFormatterComponent } from "../../formatters/alert-formatter/alert-formatter.component";
import { AlertRule, Threshold } from "../../alert-rule";
import { RowTableComponent } from "../../../common/components/sasi-table/row-table/row-table.component";
import { SimpleSortImpl } from "../../../common/components/sasi-table/simple-sort-impl";
import { MetricHandlerUtils } from "../../utils/metric-handler.utils";
import { StorageEntityMetricDto } from "../../../common/models/dtos/storage-entity-metric.dto";
import { SeTextFormatterComponent } from "../../../storage-configuration/se-text-formatter/se-text-formatter.component";

@Component({
  selector: "app-tab",
  templateUrl: "./performance-statistics.component.html",
  styleUrls: [
    "./performance-statistics.component.css",
    "../../global-statistics.component.css",
  ],
})
export class PerformanceStatisticsComponent implements OnInit, OnDestroy {
  currentPeriod: PeriodType = PeriodType.WEEK;
  data: StorageEntityMetricDto[] = []; // Todo caching data by datacenters
  options: SasiTableOptions = new SasiTableOptions();
  currentDataCenterId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metricService: MetricService,
    private periodService: PeriodService,
    private bus: BusService
  ) {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("name")
        .withLabel("System")
        .withComponent(RouteLinkFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.WORKLOAD)
        .withLabel("Workload")
        .withTooltipText("Workload Average")
        .withColumnTooltipText(
          "Average/(Peak) value of transactions per second (IOPS) for selected time period (Last Day / Last Week / Last Month)"
        )
        .withComponent(UnitFormatterComponent)
        .withAltSortEnable(true)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.TRANSFER)
        .withLabel("Transfer")
        .withTooltipText("Transfer Average")
        .withColumnTooltipText(
          "Average/(Peak) value of transferred data blocks per second (MB/s) for selected time period (Last Day / Last Week / Last Month)"
        )
        .withComponent(UnitFormatterComponent)
        .withAltSortEnable(true)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.RESPONSE)
        .withLabel("Read Response")
        .withTooltipText("Read Response Average")
        .withColumnTooltipText(
          "Average/(Peak) value of read latency on all LDEVs (both - read and write) for selected time period (Last Day / Last Week / Last Month)"
        )
        .withComponent(UnitFormatterComponent)
        .withAltSortEnable(true)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.RESPONSE_WRITE)
        .withLabel("Write Response")
        .withTooltipText("Write Response Average")
        .withColumnTooltipText(
          "Average/(Peak) value of write latency on all LDEVs (both - read and write) for selected time period (Last Day / Last Week / Last Month)"
        )
        .withComponent(UnitFormatterComponent)
        .withAltSortEnable(true)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.CPU)
        .withLabel("CPU")
        .withTooltipText("CPU Average")
        .withColumnTooltipText(
          "Average/(Peak) value of utilization on all system processors (MPBs) for selected time period (Last Day / Last Week / Last Month)"
        )
        .withComponent(UnitFormatterComponent)
        .withAltSortEnable(true)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.HDD)
        .withLabel("HDD")
        .withTooltipText("HDD Average")
        .withColumnTooltipText(
          "Average/(Peak) value of utilization on all hard disk drives / FMDs / SSD used in DP Pools for selected time period (Last Day / Last Week / Last Month)"
        )
        .withComponent(UnitFormatterComponent)
        .withAltSortEnable(true)
        .withIsAggregated(false)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex(SystemMetricType.WRITE_PENDING_PERC)
        .withLabel("Write Pending")
        .withTooltipText("Write Pending Average")
        .withColumnTooltipText(
          "Average/(Peak) value of Cache Write Pending rate on all cache modules for selected time period (Last Day / Last Week / Last Month)"
        )
        .withComponent(UnitFormatterComponent)
        .withAltSortEnable(true)
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
    this.options.rowComponentFormatter = RowTableComponent;
    this.options.labelColumnWidth = "13.78";
    this.options.valueColumnWidth = "13.78";
    this.options.sortService = new SimpleSortImpl();
    this.options.altSortColumnName = "peak";
    this.options.sortColumnNames = ["sortId", "name"];
    this.options.sortType = SasiSortType.ASC;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get("id");
      this.bus.announceDatacenter(id);
      this.bus.announceContext("performance");
      this.data = this.getTableData(id);
    });
    this.periodService.periodAnnouncement$.subscribe((period) => {
      if (this.currentPeriod !== period) {
        this.currentPeriod = period;
        this.getTableData(this.currentDataCenterId);
      }
    });
    this.periodService.announceEnablePeriod(true);
    this.periodService.announcePeriod(this.currentPeriod);
    this.options.cellDecoratorRules.push(
      new AlertRule(
        SystemMetricType.CPU,
        new Threshold("text-orange", 80, 10000)
      )
    );
    this.options.cellDecoratorRules.push(
      new AlertRule(
        SystemMetricType.WRITE_PENDING_PERC,
        new Threshold("text-orange", 30, 10000)
      )
    );
  }

  ngOnDestroy(): void {
    this.periodService.announceEnablePeriod(false);
  }

  getTableData(id: number): StorageEntityMetricDto[] {
    this.currentDataCenterId = id;
    this.metricService
      .getPerformanceStatistics(id, this.currentPeriod)
      .subscribe(
        (data) => (this.data = MetricHandlerUtils.success(data)),
        (error) => (this.data = MetricHandlerUtils.error(error))
      );
    return this.data;
  }
}
