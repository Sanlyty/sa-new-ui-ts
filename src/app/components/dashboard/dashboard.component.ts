import { Component, OnInit } from "@angular/core";
import { MetricService } from "../../metric.service";
import { Metric } from "../../common/models/metrics/metric.vo";
import { SystemMetricType } from "../../common/models/metrics/system-metric-type.enum";
import { Alert } from "../../common/models/metrics/alert.vo";
import { AlertType } from "../../common/models/metrics/alert-type.enum";
import { RegionMetricDto } from "../../common/models/dtos/region-metric.dto";
import { Region } from "../../common/models/dtos/region.enum";
import { StorageConvertPipe } from "../../common/storage-convert.pipe";
import { PeriodService } from "../../period.service";
import feMode from "src/app/FeMode";

declare var jquery: any;
declare var $: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  metricLabels = {};
  alertLabels = {};
  metrics: RegionMetricDto[] = [];
  alerts: Alert[] = [];
  alertsPerformance = [];
  alertsOperations = [];
  alertIcons = {};
  linkContext = {};
  datacenters: Metric;
  registeredSystems: Metric;
  colors = ["#a09608", "#38a008", "#08a09d", "#421570", "#f56954"];
  currentColor = 0;
  perfGraphSeries = [];
  capacityGraphSeries = [];
  perfMetricsType = ["WORKLOAD", "TRANSFER"] as const;
  logicalChangeType = "LOGICAL_CHANGE_MONTH";
  // TODO refactor to have only one of this 2 following arrays
  capacityMetricsType = [
    "SUBSCRIBED_CAPACITY",
    "LOGICAL_CAPACITY",
    "PHYSICAL_CAPACITY",
    "LOGICAL_CHANGE_MONTH",
  ] as const;
  displayCapacityType = [
    "SUBSCRIBED_CAPACITY",
    "LOGICAL_CAPACITY",
    "PHYSICAL_CAPACITY",
  ] as const;
  capacityMetricSimple = [
    "LOGICAL_CAPACITY",
    "PHYSICAL_CAPACITY",
    "SUBSCRIBED_CAPACITY",
    "WORKLOAD",
    "TRANSFER",
  ] as const;
  regionOrder = [Region.EUROPE, Region.AMERICA, Region.ASIA];
  allMetricType = [...this.perfMetricsType, ...this.capacityMetricsType];
  useKFormatter = ["WORKLOAD"];

  constructor(
    private metricService: MetricService,
    private periodService: PeriodService
  ) {}

  ngOnInit() {
    feMode.then(({ mode }) => {
      if (mode !== "hp") {
        location.replace("/global-statistics-emc/performance/-1");
      }
    });

    this.metricLabels["WORKLOAD"] = "Total Workload";
    this.metricLabels["TRANSFER"] = "Total Transfer";
    this.metricLabels["LOGICAL_CAPACITY"] = "Logical Capacity";
    this.metricLabels["PHYSICAL_CAPACITY"] = "Physical Capacity";
    this.metricLabels["SUBSCRIBED_CAPACITY"] = "Subscribed Capacity";
    this.metricLabels["LOGICAL_CHANGE_MONTH"] = "Monthly Changed (logical)";

    this.alertLabels[AlertType.CAPACITY_USAGE] = "Capacity Usage Events";
    this.alertLabels[AlertType.CPU] = "CPU Utilization Events";
    this.alertLabels[AlertType.DISBALANCE_EVENTS] = "CHA Pair Imbalances";
    this.alertLabels[AlertType.PORT_DISBALANCE_EVENTS] = "FE Port Imbalances";
    this.alertLabels[AlertType.HDD] = "HDD Utilization Events";
    this.alertLabels[AlertType.RESPONSE] = "Latency Events";
    this.alertLabels[AlertType.SLA_EVENTS] = "Out of SLA Events";
    this.alertLabels[AlertType.WRITE_PENDING] = "Cache Write Pending Events";

    this.alertIcons[AlertType.CAPACITY_USAGE] = "fa-chart-pie";
    this.alertIcons[AlertType.CPU] = "fa-tachometer-alt";
    this.alertIcons[AlertType.DISBALANCE_EVENTS] = "fa-random";
    this.alertIcons[AlertType.PORT_DISBALANCE_EVENTS] = "fa-random";
    this.alertIcons[AlertType.HDD] = "fa-hdd";
    this.alertIcons[AlertType.RESPONSE] = "fa-chart-line";
    this.alertIcons[AlertType.SLA_EVENTS] = "fa-bell";
    this.alertIcons[AlertType.WRITE_PENDING] = "fa-chart-bar";

    this.linkContext[AlertType.CAPACITY_USAGE] = "physical-capacity";
    this.linkContext[AlertType.CPU] = "performance";
    this.linkContext[AlertType.DISBALANCE_EVENTS] = "adapters";
    this.linkContext[AlertType.PORT_DISBALANCE_EVENTS] = "adapters";
    this.linkContext[AlertType.HDD] = "performance";
    this.linkContext[AlertType.RESPONSE] = "performance";
    this.linkContext[AlertType.SLA_EVENTS] = "dp-sla";
    this.linkContext[AlertType.WRITE_PENDING] = "physical-capacity";

    this.alertsPerformance.push(
      AlertType.CPU,
      AlertType.HDD,
      AlertType.WRITE_PENDING,
      AlertType.RESPONSE
    );
    this.alertsOperations.push(
      AlertType.CAPACITY_USAGE,
      AlertType.DISBALANCE_EVENTS,
      AlertType.PORT_DISBALANCE_EVENTS,
      AlertType.SLA_EVENTS
    );

    this.metricService.getInfrastructureStats().subscribe((stats) => {
      this.alerts = stats.alerts;
      this.metrics = this.transformCapacityMetrics(stats.metrics);
    });
    this.metricService.getDataCenters().subscribe((data) => {
      this.datacenters = new Metric();
      this.datacenters.value = data.length;
      this.datacenters.unit = "";
      this.registeredSystems = new Metric();
      this.registeredSystems.unit = "";
      this.registeredSystems.value = data.reduce(
        (previousValue, currentValue) => {
          return previousValue + currentValue.storageEntity.children.length;
        },
        0
      );
    });
    this.metricService
      .getGraphData(["TRANSFER", "WORKLOAD"])
      .subscribe((dto) => {
        this.perfGraphSeries = dto.data.map((serie) => {
          return { name: serie.type, data: serie.data };
        });
      });
    this.metricService
      .getCapacityGraphData([
        "SUBSCRIBED_CAPACITY",
        "LOGICAL_CAPACITY",
        "PHYSICAL_CAPACITY",
      ])
      .subscribe((dto) => {
        this.capacityGraphSeries = dto.data.map((serie) => {
          return { name: serie.type, data: serie.data };
        });
      });
    this.getMap();
    this.periodService.announceEnablePeriod(false);
  }

  transformCapacityMetrics(regionData: RegionMetricDto[]) {
    const transformer = new StorageConvertPipe();
    return regionData.map((region) => {
      const mappedRegion = new RegionMetricDto();
      mappedRegion.region = region.region;
      this.allMetricType.forEach((type) => {
        let metric;
        if (this.isSimpleChartMetric(type)) {
          metric = this.findMetricInRegion(region, type);
        } else {
          // here should be switch for specific type and also throw exception if unknown type
          const changeMetric = this.findMetricInRegion(region, "CHANGE_MONTH");
          const totalSaving = this.findMetricInRegion(
            region,
            "TOTAL_SAVING_EFFECT"
          );
          metric = new Metric();
          metric.unit = "GB";
          metric.type = "LOGICAL_CHANGE_MONTH";
          metric.value = changeMetric.value * totalSaving.value;
        }
        if (metric === undefined) {
          console.error("Cannot find " + type + " in " + region);
        }
        const translatedMetric = transformer.transform(metric);
        mappedRegion.metrics.push(translatedMetric);
      });
      return mappedRegion;
    });
  }

  getMetricValueInRegions(type: SystemMetricType, regionOrder: Region[]) {
    const metricsInAllRegions: Metric[] = [];
    regionOrder.forEach((region) => {
      const regionData = this.metrics.find(
        (metrics) => metrics.region === region
      );
      if (regionData === undefined) {
        console.error("Cannot find " + region + " in capacity statistics");
        return;
      }
      const metric = this.findMetricInRegion(regionData, type);
      metricsInAllRegions.push(metric);
    });
    return this.convertMetricsToSameUnit(metricsInAllRegions, type);
  }

  convertMetricsToSameUnit(metrics: Metric[], metricType: SystemMetricType) {
    if (metrics.length === 0) {
      return [];
    }
    const transformer = new StorageConvertPipe();
    const units = StorageConvertPipe.unitOrder[metricType];
    if (units === undefined) {
      return metrics.map((metric) => this.roundNumber(metric.value));
    }
    const targetUnit = metrics
      .map((metric) => units.findIndex((unit) => unit === metric.unit))
      .reduce((previousValue, currentValue) =>
        previousValue > currentValue ? previousValue : currentValue
      );
    return metrics
      .map((metric) =>
        transformer.transform(metric, { targetedUnitIndex: targetUnit })
      )
      .map((metric) => this.roundNumber(metric.value));
  }

  findMetricInRegion(regionData: RegionMetricDto, type): Metric {
    return regionData.metrics.find((metric) => metric.type === type);
  }

  isSimpleChartMetric(type: SystemMetricType): boolean {
    return this.capacityMetricSimple.some((simpleType) => simpleType === type);
  }

  roundNumber(value: number) {
    if (value === undefined) {
      return 0;
    }
    return parseFloat(value.toFixed(1));
  }

  findUnitInMetric(type: SystemMetricType): string {
    let foundUnit = "";
    this.metrics.forEach((region) => {
      const foundMetric: Metric = region.metrics.find(
        (metric) => metric.type === type
      );
      if (foundMetric !== undefined) {
        foundUnit = foundMetric.unit;
      }
    });
    return foundUnit;
  }

  getAlertIcon(type: SystemMetricType) {
    return this.alertIcons[type];
  }

  getMetricLabel(type: SystemMetricType) {
    return this.metricLabels[type];
  }

  getLinkContext(type: SystemMetricType) {
    return this.linkContext[type];
  }

  getAlertLabel(type: AlertType) {
    return this.alertLabels[type];
  }

  getAlert(type: AlertType) {
    return this.alerts.find((searchAlert) => searchAlert.type === type);
  }

  getRegionLabels() {
    return ["Europe", "America", "Asia"];
  }

  isKFormatterUsed(type: SystemMetricType): boolean {
    return this.useKFormatter.some((kType) => kType === type);
  }

  getMap(): void {
    $(function () {
      $("#world-map-markers").vectorMap({
        map: "world_mill_en",
        scaleColors: ["#C8EEFF", "#0071A4"],
        normalizeFunction: "polynomial",
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
          initial: {
            fill: "#F8E23B",
            stroke: "#383f47",
          },
        },
        markerLabelStyle: {
          initial: {
            display: "inline",
          },
        },

        backgroundColor: "#3c8dbc",

        markers: [
          { latLng: [50.05, 14.48], name: "CZ_Sitel" },
          { latLng: [50.07, 14.44], name: "CZ_Chodov" },
          { latLng: [2.9, 101.65], name: "MY_Cyberjaja" },
          { latLng: [3.14, 101.7], name: "MY_AIMS" },
          { latLng: [39.04, -77.48], name: "US_Ashburn" },
          { latLng: [40.21, -77.0], name: "US_Mechanigsburg" },
        ],
      });
    });
  }
}
