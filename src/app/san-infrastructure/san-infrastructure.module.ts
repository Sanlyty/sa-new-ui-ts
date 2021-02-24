import {NgModule} from '@angular/core';
import {SanInfrastructureComponent} from './san-infrastructure.component';
import {CommonModule} from '@angular/common';
import {SanInfrastructureRoutingModule} from './san-infrastructure-routing.module';
import {SaCommonModule} from '../common/sa-common.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {BlockSizeLatencyComponent} from './views/block-size-latency/block-size-latency.component';
import {BubbleChartComponent} from './views/block-size-latency/bubble-chart/bubble-chart.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {FilterListComponent} from './views/block-size-latency/filter-list/filter-list.component';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {XaxisComponent} from './views/block-size-latency/bubble-chart/xaxis/xaxis.component';
import {YaxisComponent} from './views/block-size-latency/bubble-chart/yaxis/yaxis.component';
import {LegendComponent} from './views/block-size-latency/bubble-chart/legend/legend.component';
import {PopupDataComponent} from './views/block-size-latency/bubble-chart/popup-data/popup-data.component';

@NgModule({
  declarations: [
    SanInfrastructureComponent,
    BlockSizeLatencyComponent,
    BubbleChartComponent,
    FilterListComponent,
    XaxisComponent,
    YaxisComponent,
    LegendComponent,
    PopupDataComponent,
  ],
  exports: [

  ],
  imports: [
    CommonModule,
    SanInfrastructureRoutingModule,
    SaCommonModule,
    TooltipModule,
    NgApexchartsModule,
    NgSelectModule,
    FormsModule
  ]
})
export class SanInfrastructureModule {
}
