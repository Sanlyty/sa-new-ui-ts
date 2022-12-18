import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { SideMenuComponent } from "./components/side-menu/side-menu.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { GlobalStatisticsModule } from "./global-statistics/global-statistics.module";
import { SanInfrastructureModule } from "./san-infrastructure/san-infrastructure.module";
import { SaCommonModule } from "./common/sa-common.module";
import { SystemPool2SasiGroupTablePipe } from "./common/utils/system-pool-2-sasi-group-table.pipe";
import { NgApexchartsModule } from "ng-apexcharts";
import { RegionDonutComponent } from "./components/dashboard/charts/region-donut/region-donut.component";
import { FormsModule } from "@angular/forms";
import { WebStorageModule } from "ngx-store-9";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HistoryChartComponent } from "./components/dashboard/charts/history-chart/history-chart.component";
import { CapacityHistoryChartComponent } from "./components/dashboard/charts/capacity-history-chart/capacity-history-chart.component";
import { BarChartComponent } from "./components/dashboard/charts/bar-chart/bar-chart.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { HttpLoading } from "./http-loading.interceptor";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { StorageConfigurationModule } from "./storage-configuration/storage-configuration.module";
import { OverviewModule } from "./overview/overview.module";
import { EmcGlobalStatisticsModule } from "./emc-global-statistics/emc-global-statistics.module";

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpLoading, multi: true },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SideMenuComponent,
    DashboardComponent,
    RegionDonutComponent,
    HistoryChartComponent,
    CapacityHistoryChartComponent,
    BarChartComponent,
    BreadcrumbComponent,
  ],
  imports: [
    GlobalStatisticsModule,
    EmcGlobalStatisticsModule,
    SanInfrastructureModule,
    OverviewModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    WebStorageModule,
    BrowserAnimationsModule,
    SaCommonModule,
    NgApexchartsModule,
    NgxSpinnerModule,
    StorageConfigurationModule,
  ],
  providers: [SystemPool2SasiGroupTablePipe, httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
