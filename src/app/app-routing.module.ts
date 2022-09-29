import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IframeComponent } from "./components/iframe/iframe.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { SaOverviewComponent } from "./overview/sa-overview.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    data: {
      breadcrumb: "Dashboard",
    },
  },
  { path: "iframe/:url", component: IframeComponent },
  {
    path: "overview/:system/:view",
    component: SaOverviewComponent,
    data: {
      breadcrumb: "Overview",
    },
  },
  {
    path: "storage-config",
    loadChildren:
      "./storage-configuration/storage-configuration.module#StorageConfigurationModule",
    data: {
      breadcrumb: "Storage Configuration",
    },
  },
  {
    path: "global-statistics",
    loadChildren:
      "./global-statistics/global-statistics.module#GlobalStatisticsModule",
  },
  {
    path: "san-infrastructure",
    loadChildren:
      "./san-infrastructure/san-infrastructure.module#SanInfrastructureModule",
  },
  {
    path: "",
    component: DashboardComponent,
    data: {
      breadcrumb: "Dashboard",
    },
  },
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { enableTracing: true }) // debugging
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
