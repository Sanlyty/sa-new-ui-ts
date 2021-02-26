import {NgModule} from '@angular/core';
import {SanInfrastructureComponent} from './san-infrastructure.component';
import {CommonModule} from '@angular/common';
import {SanInfrastructureRoutingModule} from './san-infrastructure-routing.module';
import {SaCommonModule} from '../common/sa-common.module';
import {TooltipModule} from 'ng2-tooltip-directive';
import {NgApexchartsModule} from 'ng-apexcharts';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import { TopTalkersComponent } from './views/top-talkers/top-talkers.component';

@NgModule({
  declarations: [
    SanInfrastructureComponent,
    TopTalkersComponent,
    // BlockSizeLatencyComponent,
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
