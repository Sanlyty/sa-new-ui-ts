import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MetricService } from "../../metric.service";
import { Owner } from "../../common/models/dtos/owner.dto";
import { StorageEntityDetailRequestDto } from "../../common/models/dtos/storage-entity-detail-request.dto";

const keyMap: { [key: string]: string } = { cover_rooms: "covers" };

@Component({
  selector: "app-import-csv-data",
  templateUrl: "./import-csv-data.component.html",
  styleUrls: ["./import-csv-data.component.css"],
})
export class ImportCsvDataComponent implements OnInit {
  @Input()
  keyColumn: string;
  @Input()
  data: Owner[];
  header: string[] = [];
  fileName: string = null;
  dataVo: any[] = [];
  successfullyUpdated = 0;
  failUpdated = 0;
  notFoundCount = 0;
  validData = [];
  @Output()
  importFinished = new EventEmitter();

  constructor(private metricService: MetricService) {}

  ngOnInit() {}

  changeListener(files: FileList) {
    console.log(files);
    if (files === undefined || files.length === 0) {
      return;
    }
    const file: File = files.item(0);
    this.fileName = file.name;
    // File reader method
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      const csv: string = reader.result as string;
      const allTextLines = csv.split(/\r\n|\n|\r/);
      // Table Headings
      this.header = allTextLines[0].split(",").map((k) => keyMap[k] ?? k);
      const csvData = allTextLines
        .slice(1, allTextLines.length)
        .map((line) => line.split(","));
      this.dataVo = csvData.map((line) => {
        const vo = {};
        this.header.forEach((column, index) => {
          if (column === "automation") {
            vo[column] = line[index] === "enable";
          } else {
            vo[column] = line[index];
          }
        });
        return vo;
      });
      console.log(this.dataVo);
      this.validData = this.dataVo.filter(
        (vo) =>
          this.data.find(
            (owner) => owner[this.keyColumn] === vo[this.keyColumn]
          ) !== undefined
      );
    };
  }

  reset() {
    this.fileName = null;
    this.successfullyUpdated = 0;
    this.failUpdated = 0;
  }

  updateData() {
    this.validData.forEach((vo) => {
      const foundData = this.data.find(
        (owner) => owner[this.keyColumn] === vo[this.keyColumn]
      );
      if (foundData === undefined) {
        console.error(vo[this.keyColumn] + " not found");
        return;
      } else {
        const dto = new StorageEntityDetailRequestDto();
        this.header.forEach((column) => {
          dto[column] = vo[column];
        });
        this.metricService.updateStorageEntity(foundData.id, dto).subscribe(
          (data) => {
            this.successfullyUpdated++;
            if (this.validData.length === this.successfullyUpdated) {
              this.importFinished.emit();
              this.reset();
            }
          },
          (err) => {
            this.failUpdated++;
          }
        );
      }
    });
  }
}
