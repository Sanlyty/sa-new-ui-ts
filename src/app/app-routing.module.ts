import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IframeComponent} from './components/iframe/iframe.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

const routes: Routes = [

  {path: 'dashboard', component: DashboardComponent},
  {path: 'iframe/:url', component: IframeComponent},
  {
    path: 'global-statistics',
    loadChildren: './components/global-statistics/global-statistics.module#GlobalStatisticsModule',
  },
  {path: '', component: DashboardComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
