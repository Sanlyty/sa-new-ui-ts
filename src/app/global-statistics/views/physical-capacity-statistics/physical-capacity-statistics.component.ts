import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MetricService } from "../../../metric.service";
import { SystemAggregatedStatistics } from "../../utils/weighted-arithmetic-mean.utils";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  SasiColumnBuilder,
  SasiTableOptions,
} from "../../../common/components/sasi-table/sasi-table.component";
import { RouteLinkFormatterComponent } from "../../../common/components/route-link-formatter/route-link-formatter.component";
import { SimpleFormatterComponent } from "../../formatters/simple-formatter/simple-formatter.component";
import { AlertFormatterComponent } from "../../formatters/alert-formatter/alert-formatter.component";
import { RowGroupTableComponent } from "../../../common/components/sasi-table/row-group-table/row-group-table.component";
import { AlertRule, Threshold } from "../../alert-rule";
import { SasiWeightedArithmeticMeanUtils } from "../../utils/sasi-weighted-arithmetic-mean.utils";
import { GroupSortImpl } from "../../../common/components/sasi-table/group-sort-impl";
import { LocalStorageService } from "ngx-store-9";
import { SelectedRow } from "../../../common/components/sasi-table/row-table/selected-row";
import { StorageEntityMetricDto } from "../../../common/models/dtos/storage-entity-metric.dto";
import { MetricHandlerUtils } from "../../utils/metric-handler.utils";
import { SeTextFormatterComponent } from "../../../storage-configuration/se-text-formatter/se-text-formatter.component";

@Component({
  selector: "app-capacity-statistics",
  templateUrl: "./physical-capacity-statistics.component.html",
  styleUrls: [
    "./physical-capacity-statistics.component.css",
    "../../global-statistics.component.css",
  ],
  animations: [
    trigger("slideInOut", [
      state("true", style({ height: "0px", overflow: "hidden", margin: "0" })),
      state("false", style({ height: "*", overflow: "hidden", margin: "0" })),
      transition("1 => 0", animate("500ms ease-in")),
      transition("0 => 1", animate("500ms ease-out")),
    ]),
    trigger("iconRotate", [
      state("false", style({ transform: "rotate(0deg)" })),
      state("true", style({ transform: "rotate(90deg)" })),
      transition("1 => 0", animate("500ms")),
      transition(":enter", animate("0ms")),
      transition(":leave", animate("0ms")),
      transition("0 => 1", animate("500ms")),
    ]),
  ],
})
export class PhysicalCapacityStatisticsComponent implements OnInit {
  types = [
    "PHYSICAL_SUBS_PERC",
    "PHYSICAL_CAPACITY",
    "AVAILABLE_CAPACITY",
    "LOGICAL_USED_PERC",
    "PHYSICAL_USED_PERC",
    "COMPRESSION_RATIO",
    "PREDICTION_L1",
    "PREDICTION_L2",
    "PREDICTION_L3",
  ];
  data: StorageEntityMetricDto[] = []; // Todo caching data by dataCenters

  aggregatedStats: SystemAggregatedStatistics[] =
    new Array<SystemAggregatedStatistics>();

  options: SasiTableOptions = new SasiTableOptions();

  // TODO common with logical capacity
  selectedRows: Array<SelectedRow>;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected metricService: MetricService,
    protected localStorageService: LocalStorageService
  ) {
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("name")
        .withLabel("Pool")
        .withAltLabel("System")
        .withComponent(RouteLinkFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .withAltBorder(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("PHYSICAL_CAPACITY")
        .withLabel("Physical\nCapacity")
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withColumnTooltipText(
          "Total physical capacity (TB) of the DP Pool. Physical capacity = capacity of the real HW components (HDDs/FMDs/Spindles)."
        )
        .build()
    );

    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("PHYSICAL_SUBS_PERC")
        .withLabel("Physical Subs.")
        .withColumnTooltipText(
          "Physical Subscribed capacity (%) of the DP Pool."
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("AVAILABLE_CAPACITY")
        .withLabel("Available\n" + "Capacity")
        .withColumnTooltipText(
          "Physically free capacity (TB) of the DP Pool. Meaning what is the physical free space on HW components (HDDs/FMDs/Spindles)"
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("LOGICAL_USED_PERC")
        .withLabel("Logical Used")
        .withColumnTooltipText(
          'Logical Used capacity (%) of the DP Pool. Logical capacity is "virtual" capacity for non-spindle disk pools. It is calculated as [physical capacity] x [constant]. In common cases [constant] is set to 2'
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("PHYSICAL_USED_PERC")
        .withLabel("Physical Used")
        .withColumnTooltipText(
          "Capacity which is physically stored on DP Pool HDD's in %"
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("TOTAL_SAVING_EFFECT")
        .withLabel("Total Savings")
        .withColumnTooltipText(
          "Total saving effect of Deduplication (SW feature) + Compression (FMD's). Summmary calculation is performed on pools with total saving effect >1)"
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText("Total Saving Effect")
        .withShortLabel("Total")
        .withAltBorder(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("PREDICTION_L1")
        .withLabel("Reach 80%")
        .withColumnTooltipText(
          'Prediction how many days left before reaching 80% treshold of "Physical Used [%]" metric.'
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .withTooltipText('Days to reach 80% of "Physical Used"')
        .withInfinity(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("PREDICTION_L2")
        .withLabel("Reach 85%")
        .withColumnTooltipText(
          'Prediction how many days left before reaching 85% treshold of "Physical Used [%]" metric.'
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .withTooltipText('Days to reach 85% of "Physical Used"')
        .withInfinity(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("PREDICTION_L3")
        .withLabel("Reach 88%")
        .withColumnTooltipText(
          'Prediction how many days left before reaching 88% treshold of "Physical Used [%]" metric.'
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(false)
        .withTooltipText('Days to reach 88% of "Physical Used"')
        .withInfinity(true)
        .withAltBorder(true)
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("CHANGE_DAY")
        .withLabel("Change 1D")
        .withColumnTooltipText(
          'Calculated change of "Physical Capacity" in GB [Today]-[Yesterday] of the DP Pool'
        )
        .withComponent(SimpleFormatterComponent)
        .withInfinity(false)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withTooltipText("One Day Change")
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("CHANGE_WEEK")
        .withLabel("Change 1W")
        .withColumnTooltipText(
          'Calculated change of "Physical Capacity" in GB [Today]-[7 Days Back] of the DP Pool'
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withInfinity(false)
        .withTooltipText("One Week Change")
        .build()
    );
    this.options.columns.push(
      SasiColumnBuilder.getInstance()
        .withIndex("CHANGE_MONTH")
        .withLabel("Change 1M")
        .withColumnTooltipText(
          'Calculated change of "Physical Capacity" in GB [Today]-[30 Days Back] of the DP Pool'
        )
        .withComponent(SimpleFormatterComponent)
        .withAltSortEnable(false)
        .withIsAggregated(true)
        .withInfinity(false)
        .withTooltipText("One Month Change")
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
    this.options.labelColumnWidth = "13";
    this.options.valueColumnWidth = "6.65";
    this.options.storageNamePrefix = "physicalCap";
    this.options.selectableRows = true;
    this.options.aggregateValuesService = new SasiWeightedArithmeticMeanUtils();
    this.options.sortService = new GroupSortImpl();
    this.options.sortColumnNames = ["sortId", "name"];
    this.options.columnAlign = "right";

    this.options.cellDecoratorRules.push(
      new AlertRule("PHYSICAL_USED_PERC", new Threshold("text-green", 80, 84.9))
    );
    this.options.cellDecoratorRules.push(
      new AlertRule(
        "PHYSICAL_USED_PERC",
        new Threshold("text-alert-yellow", 85, 88)
      )
    );
    this.options.cellDecoratorRules.push(
      new AlertRule("PHYSICAL_USED_PERC", new Threshold("text-red", 88, 10000))
    );
  }

  // Todo common with logical stats
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get("id");
      this.getTableData(id);
    });
    this.localStorageService
      .observe(this.options.storageNamePrefix + "_selected")
      .subscribe((data) => {
        this.selectedRows = data.newValue;
      });
  }

  getTableData(id: number): StorageEntityMetricDto[] {
    this.metricService.getCapacityStatistics(id).subscribe(
      (data) => {
        this.data = MetricHandlerUtils.success(data);
        console.log(this.data);
      },
      (error) => (this.data = MetricHandlerUtils.error(error))
    );
    return this.data;
  }

  selectTier(tier: number) {
    document.querySelectorAll(".system-name").forEach((sysElem) => {
      if (!(sysElem as HTMLElement).innerText.endsWith(`-T${tier}`)) return;

      sysElem
        .closest("app-row-table")
        .querySelector(".ng-trigger > i")
        .dispatchEvent(new Event("click"));
    });
  }
}
