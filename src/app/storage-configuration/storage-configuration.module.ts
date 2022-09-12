import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StorageLocationComponent } from "./storage-location/storage-location.component";
import { StorageConfigurationRoutingModule } from "./storage-configuration-routing.module";
import { SaCommonModule } from "../common/sa-common.module";
import { GlobalStatisticsModule } from "../global-statistics/global-statistics.module";
import { TooltipModule } from "ng2-tooltip-directive";
import { SeTextFormatterComponent } from "./se-text-formatter/se-text-formatter.component";
import { SerialNumberFormatterComponent } from "./serial-number-formatter/serial-number-formatter.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StorageEntityFormComponent } from "./storage-entity-form/storage-entity-form.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { PortConnectivityComponent } from "./port-connectivity/port-connectivity.component";
import { ControllerListComponent } from "./controller-list/controller-list.component";
import { DkcListComponent } from "./dkc-list/dkc-list.component";
import { ChannelBoardListComponent } from "./channel-board-list/channel-board-list.component";
import { PortListComponent } from "./port-list/port-list.component";
import { StorageEntity2SasiGroupTablePipe } from "./storage-entity-2-sasi-table/storage-entity-2-sasi-group-table.pipe";
import { StorageEntityDetail2SasiTablePipe } from "./storage-entity-2-sasi-table/storage-entity-detail-2-sasi-table.pipe";
import { SpeedFormatterComponent } from "./speed-formatter/speed-formatter.component";
import { ImportCsvDataComponent } from "./import-csv-data/import-csv-data.component";
import { StorageEntityStatusComponent } from "./storage-entity-status/storage-entity-status.component";
import {
  ComplexHierarchicalTreeService,
  DataBindingService,
  DiagramModule,
  HierarchicalTreeService,
  MindMapService,
} from "@syncfusion/ej2-angular-diagrams";
import { PortConnectivityDiagramComponent } from "./port-connectivity-diagram/port-connectivity-diagram.component";
import { CheckmarkComponent } from "./checkmark/checkmark.component";

@NgModule({
  declarations: [
    StorageLocationComponent,
    SeTextFormatterComponent,
    CheckmarkComponent,
    SpeedFormatterComponent,
    SerialNumberFormatterComponent,
    StorageEntityFormComponent,
    PortConnectivityComponent,
    ControllerListComponent,
    DkcListComponent,
    ChannelBoardListComponent,
    PortListComponent,
    StorageEntity2SasiGroupTablePipe,
    StorageEntityDetail2SasiTablePipe,
    ImportCsvDataComponent,
    StorageEntityStatusComponent,
    PortConnectivityDiagramComponent,
  ],
  entryComponents: [SeTextFormatterComponent, SerialNumberFormatterComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    SaCommonModule,
    GlobalStatisticsModule,
    StorageConfigurationRoutingModule,
    TooltipModule,
    FormsModule,
    ReactiveFormsModule,
    DiagramModule,
  ],
  providers: [
    HierarchicalTreeService,
    DataBindingService,
    ComplexHierarchicalTreeService,
  ],
})
export class StorageConfigurationModule {}
