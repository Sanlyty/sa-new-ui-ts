import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmcGlobalStatisticsComponent } from "./emc-global-statistics.component";
import { CapacityComponent } from "./views/capacity/capacity.component";
import { ImbalanceComponent } from "./views/imbalance/imbalance.component";
import { PerformanceComponent } from "./views/performance/performance.component";
import { VmwareComponent } from "./views/vmware/vmware.component";

const routes: Routes = [
  {
    path: "global-statistics-emc",
    component: EmcGlobalStatisticsComponent,
    data: {
      breadcrumb: "EMC Global Statistics",
      url: "/",
    },
    children: [
      {
        path: "performance/:id",
        component: PerformanceComponent,
        data: {
          breadcrumb: "Performance Statistics",
        },
      },
      {
        path: "performance",
        redirectTo: "performance/-1",
        pathMatch: "full",
      },

      {
        path: "capacity/:id",
        component: CapacityComponent,
        data: {
          breadcrumb: "Capacity Statistics",
        },
      },
      {
        path: "capacity",
        redirectTo: "capacity/-1",
        pathMatch: "full",
      },

      {
        path: "imbalance/:id",
        component: ImbalanceComponent,
        data: {
          breadcrumb: "Imbalance Statistics",
        },
      },
      {
        path: "imbalance",
        redirectTo: "imbalance/-1",
        pathMatch: "full",
      },

      {
        path: "vmware/:id",
        component: VmwareComponent,
        data: {
          breadcrumb: "VMWare Statistics",
        },
      },
      {
        path: "vmware",
        redirectTo: "vmware/-1",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmcGlobalStatisticsRoutingModule {}
