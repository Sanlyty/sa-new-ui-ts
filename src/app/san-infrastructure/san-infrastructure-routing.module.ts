import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { TopTalkersComponent } from './views/top-talkers/top-talkers.component';

const routes: Routes = [
  {
    path: 'san-infrastructure/top-talkers',
    component: TopTalkersComponent,
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
