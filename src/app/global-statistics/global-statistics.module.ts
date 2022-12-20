import { NgModule } from "@angular/core";
import { PerformanceStatisticsComponent } from "./views/performance-statistics/performance-statistics.component";
import { PhysicalCapacityStatisticsComponent } from "./views/physical-capacity-statistics/physical-capacity-statistics.component";
import { GlobalStatisticsComponent } from "./global-statistics.component";
import { CommonModule } from "@angular/common";
import { GlobalStatisticsRoutingModule } from "./global-statistics-routing.module";
import { SaCommonModule } from "../common/sa-common.module";
import { TooltipModule } from "ng2-tooltip-directive";
import { DpSlaComponent } from "./views/dp-sla/dp-sla.component";
import { AdaptersComponent } from "./views/adapters/adapters.component";
import { UnitFormatterComponent } from "./formatters/unit-formatter/unit-formatter.component";
import { AlertFormatterComponent } from "./formatters/alert-formatter/alert-formatter.component";
import { SimpleFormatterComponent } from "./formatters/simple-formatter/simple-formatter.component";
import { TimeFormatterComponent } from "./formatters/time-formatter/time-formatter.component";
import { Seconds2FullTimePipe } from "./utils/seconds-2-full-time.pipe";
import { TextFormatterComponent } from "./formatters/text-formatter/text-formatter.component";
import { AggregatedStatisticsComponent } from "./components/aggregated-statistics/aggregated-statistics.component";
import { TierSelectComponent } from "./components/tier-select/tier-select.component";
import { EmphFormatterComponent } from "./formatters/emph-formatter/emph-formatter.component";
import { PortDisbalanceFormatterComponent } from "./formatters/port-disbalance-formatter/port-disbalance-formatter.component";
import { LogicalCapacityStatisticsComponent } from "./views/logical-capacity-statistics/logical-capacity-statistics.component";
import { GlobalPhysicalCapacityStatisticsComponent } from "./components/aggregated-statistics/global-physical-capacity-statistics.component";
import { GlobalLogicalStatisticsComponent } from "./components/grouped-aggregated-statistics/global-logical-statistics.component";
import { GroupedAggregatedStatisticsComponent } from "./components/grouped-aggregated-statistics/grouped-aggregated-statistics.component";
import { HostGroupsCapacityComponent } from "./views/host-groups-capacity/host-groups-capacity.component";
import { GlobalHostGroupCapacityComponent } from "./components/aggregated-statistics/global-host-group-capacity.component";
import { TierFormatterComponent } from "./formatters/tier-formatter/tier-formatter.component";
import { AdapterDisbalanceFormatterComponent } from "./formatters/adapter-disbalance-formatter/adapter-disbalance-formatter.component";
import { EmptyFormatterComponent } from "./formatters/empty-formatter/empty-formatter.component";
import { BlockSizeLatencyComponent } from "./views/block-size-latency/block-size-latency.component";
import { BubbleChartComponent } from "./views/block-size-latency/bubble-chart/bubble-chart.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { FilterListComponent } from "./views/block-size-latency/filter-list/filter-list.component";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { XaxisComponent } from "./views/block-size-latency/bubble-chart/xaxis/xaxis.component";
import { YaxisComponent } from "./views/block-size-latency/bubble-chart/yaxis/yaxis.component";
import { LegendComponent } from "./views/block-size-latency/bubble-chart/legend/legend.component";
import { PopupDataComponent } from "./views/block-size-latency/bubble-chart/popup-data/popup-data.component";
import { ParityGroupEventsComponent } from "./views/parity-group-events/parity-group-events.component";
import { TimestampToDateComponent } from "./formatters/timestamp-to-date/timestamp-to-date.component";
import { TimeIntervalFormatterComponent } from "./formatters/time-interval-formatter/time-interval-formatter.component";
import { DurationFormatterComponent } from "./formatters/duration-formatter/duration-formatter.component";
import { ParityGroup2SasiGroupTablePipe } from "./views/parity-group-events/parity-group-2-sasi-group-table.pipe";
import { ParityGroup2SasiTablePipe } from "./views/parity-group-events/parity-group-2-sasi-table.pipe";

@NgModule({
  declarations: [
    GlobalStatisticsComponent,
    PhysicalCapacityStatisticsComponent,
    PerformanceStatisticsComponent,
    TierSelectComponent,
    DpSlaComponent,
    AdaptersComponent,
    UnitFormatterComponent,
    AlertFormatterComponent,
    SimpleFormatterComponent,
    TimeFormatterComponent,
    Seconds2FullTimePipe,
    TextFormatterComponent,
    AggregatedStatisticsComponent,
    GroupedAggregatedStatisticsComponent,
    EmphFormatterComponent,
    PortDisbalanceFormatterComponent,
    LogicalCapacityStatisticsComponent,
    GlobalPhysicalCapacityStatisticsComponent,
    GlobalLogicalStatisticsComponent,
    HostGroupsCapacityComponent,
    GlobalHostGroupCapacityComponent,
    TierFormatterComponent,
    AdapterDisbalanceFormatterComponent,
    EmptyFormatterComponent,
    BlockSizeLatencyComponent,
    BubbleChartComponent,
    FilterListComponent,
    XaxisComponent,
    YaxisComponent,
    LegendComponent,
    PopupDataComponent,
    ParityGroupEventsComponent,
    TimestampToDateComponent,
    TimeIntervalFormatterComponent,
    DurationFormatterComponent,
    ParityGroup2SasiGroupTablePipe,
    ParityGroup2SasiTablePipe,
  ],
  exports: [
    UnitFormatterComponent,
    AggregatedStatisticsComponent,
    GroupedAggregatedStatisticsComponent,
  ],
  imports: [
    CommonModule,
    GlobalStatisticsRoutingModule,
    SaCommonModule,
    TooltipModule,
    NgApexchartsModule,
    NgSelectModule,
    FormsModule,
  ],
})
export class GlobalStatisticsModule {}
