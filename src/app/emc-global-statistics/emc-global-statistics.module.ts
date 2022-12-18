import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmcGlobalStatisticsComponent } from "./emc-global-statistics.component";
import { EmcGlobalStatisticsRoutingModule } from "./emc-global-statistics-routing.module";
import { PerformanceComponent } from "./views/performance/performance.component";
import { CapacityComponent } from './views/capacity/capacity.component';
import { ImbalanceComponent } from './views/imbalance/imbalance.component';
import { VmwareComponent } from './views/vmware/vmware.component';

@NgModule({
  declarations: [EmcGlobalStatisticsComponent, PerformanceComponent, CapacityComponent, ImbalanceComponent, VmwareComponent],
  imports: [CommonModule, EmcGlobalStatisticsRoutingModule],
})
export class EmcGlobalStatisticsModule {}
