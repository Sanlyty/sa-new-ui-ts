import {Component, Input, OnInit} from '@angular/core';
import {SystemMetric} from '../../common/models/metrics/system-metric.vo';
import {SasiColumn, SasiRow} from '../../common/components/sasi-table/sasi-table.component';
import {FormBusService} from '../form-bus.service';
import {StorageEntityVo} from '../storage-entity-form/storage-entity-form.component';
import {StorageEntityType} from '../../common/models/dtos/owner.dto';

@Component({
  selector: 'app-se-text-formatter',
  templateUrl: './se-text-formatter.component.html',
  styleUrls: ['./se-text-formatter.component.css']
})
export class SeTextFormatterComponent implements OnInit {

  @Input() label;
  @Input() public data: SystemMetric;
  @Input() public column: SasiColumn;
  @Input() public rowData: SasiRow;
  constructor(private formBus: FormBusService) { }

  ngOnInit() {
  }

  getValue() {
    if (this.column === undefined) {
      return this.data['value'];
    }


    return this.data.value;
  }

  openForm() {
    console.log(this.rowData);
    console.log(this.column);
    console.log(this.data);
    const formData = new StorageEntityVo();
    if (this.column === undefined) {
      formData.id = this.data['dbId'];
      formData.name = this.data['value'].toString();
      formData.type = StorageEntityType.DATACENTER;
    } else {
      formData.type = StorageEntityType.SYSTEM;
      formData.serialNumber = this.getCellValue('serialNumber');
      formData.parentId = this.getCellValue('parentId');
      formData.prefixReferenceId = this.getCellValue('prefixReferenceId');
      formData.name = this.getCellValue('name');
      formData.id = this.getCellValue('id');
      formData.dkc = this.getCellValue('dkc');
      formData.room = this.getCellValue('room');
      formData.rack = this.getCellValue('rack');
      formData.arrayModel = this.getCellValue('arrayModel');
      formData.managementIp = this.getCellValue('managementIp');

    }
    this.formBus.sendFormData(formData);
  }

  getCellValue(valueName: string) {
    if (this.rowData.cells[valueName] !== undefined) {
      return this.rowData.cells[valueName].value;
    }
    return null;
  }
}
