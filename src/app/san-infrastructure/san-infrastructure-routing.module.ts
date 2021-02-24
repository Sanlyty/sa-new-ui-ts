import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BlockSizeLatencyComponent} from './views/block-size-latency/block-size-latency.component';

const routes: Routes = [
  {
    path: 'san-infrastructure/top-talkers',
    component: BlockSizeLatencyComponent,
    data: {
      breadcrumb: 'SAN Infrastructure'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SanInfrastructureRoutingModule {
}
