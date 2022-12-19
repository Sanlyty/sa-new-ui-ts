import { SystemMetricType } from "../../common/models/metrics/system-metric-type.enum";
import {
  SasiCell,
  SasiGroupRow,
  SasiRow,
} from "../../common/components/sasi-table/sasi-table.component";
import {
  AggregatedValues,
  AggregateValueService,
} from "../../common/components/sasi-table/row-group-table/row-group-table.component";
import { SelectedRow } from "../../common/components/sasi-table/row-table/selected-row";
import { Metric } from "../../common/models/metrics/metric.vo";

// Todo implementation is same also in SumValueServiceImpl
export class SystemAggregatedStatistics implements AggregatedValues {
  system = null;
  values: Metric[] = [];

  constructor(systemName: string) {
    this.system = systemName;
  }

  getValue(name: string): Metric {
    return this.values[name];
  }

  setMetric(type, value) {
    this.values[type] = value;
  }

  setValue(type, value, unit: string) {
    if (value === null || value === undefined) {
      return;
    }
    if (this.values[type] === undefined) {
      const metric = new Metric();
      metric.type = type;
      metric.unit = unit;
      metric.value = 0;
      this.setMetric(type, metric);
    } else {
      if (this.values[type].unit === null && unit != null) {
        this.values[type].unit = unit;
      }
    }

    this.values[type].value += value;
  }
}

export class SasiWeightedArithmeticMeanUtils implements AggregateValueService {
  systemSummarizedValues: SystemAggregatedStatistics[] =
    new Array<SystemAggregatedStatistics>();
  partiallySummarizedValues: SystemAggregatedStatistics =
    new SystemAggregatedStatistics("all");
  physicalCapacityCompRatio = 0;
  physicalCapacityDedupRatio = 0;
  physicalCapacityTotalSaving = 0;

  computeSummaries(
    inputRowGroup: SasiGroupRow[],
    filter: Array<SelectedRow>
  ): AggregatedValues {
    this.physicalCapacityTotalSaving = 0;
    this.physicalCapacityDedupRatio = 0;
    this.physicalCapacityCompRatio = 0;
    if (filter.length === 0) {
      return null;
    }
    this.systemSummarizedValues = new Array<SystemAggregatedStatistics>();
    this.partiallySummarizedValues = new SystemAggregatedStatistics("");
    const amendFilter = filter.filter((key) => {
      const rowGroup = inputRowGroup.find(
        (row) => row.groupRow.getCell("name").value === key.groupName
      );
      if (rowGroup === undefined) {
        return null;
      }
      // Todo should be some configuration for Unique id column
      const sasiRow: SasiRow = rowGroup.rows.find(
        (row) => row.getCell("name").value === key.rowName
      );
      if (sasiRow === undefined) {
        return null;
      }
      return true;
    });
    if (amendFilter.length === 0) {
      return null;
    }
    amendFilter.forEach((key) => {
      const rowGroup = inputRowGroup.find(
        (row) => row.groupRow.getCell("name").value === key.groupName
      );
      if (rowGroup === undefined) {
        return null;
      }
      // Todo should be some configuration for Unique id column
      const sasiRow: SasiRow = rowGroup.rows.find(
        (row) => row.getCell("name").value === key.rowName
      );
      if (sasiRow === undefined) {
        return null;
      }
      const physicalCapacity = this.getMetricValueByName(
        sasiRow,
        "PHYSICAL_CAPACITY"
      );
      const netTotal = this.getMetricValueByName(sasiRow, "NET_TOTAL");
      this.setPartialValue(
        "PHYSICAL_CAPACITY",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "SUBSCRIBED_CAPACITY",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "LOGICAL_CAPACITY",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "AVAILABLE_CAPACITY",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "LOGICAL_USED",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "LOGICAL_FREE",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "PHYSICAL_USED",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "PHYSICAL_FREE",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "NET_TOTAL",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue("NET_USED", sasiRow, this.partiallySummarizedValues);
      this.setPartialValue("NET_FREE", sasiRow, this.partiallySummarizedValues);
      this.setPartialValue(
        "PHYSICAL_SUBS_PERC",
        sasiRow,
        this.partiallySummarizedValues,
        physicalCapacity
      );
      this.setPartialValue(
        "LOGICAL_SUBS_PERC",
        sasiRow,
        this.partiallySummarizedValues,
        physicalCapacity
      );
      this.setPartialValue(
        "NET_SUBS_PERC",
        sasiRow,
        this.partiallySummarizedValues,
        physicalCapacity
      );
      this.setPartialValue(
        "LOGICAL_USED_PERC",
        sasiRow,
        this.partiallySummarizedValues,
        physicalCapacity
      );
      this.setPartialValue(
        "PHYSICAL_USED_PERC",
        sasiRow,
        this.partiallySummarizedValues,
        physicalCapacity
      );
      this.setPartialValue(
        "NET_USED_PERC",
        sasiRow,
        this.partiallySummarizedValues,
        netTotal
      );
      this.setPartialValue(
        "COMPRESSION_RATIO",
        sasiRow,
        this.partiallySummarizedValues,
        physicalCapacity,
        0
      );
      this.setPartialValue(
        "CHANGE_DAY",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "CHANGE_WEEK",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "CHANGE_MONTH",
        sasiRow,
        this.partiallySummarizedValues
      );
      this.setPartialValue(
        "DEDUP_RATIO",
        sasiRow,
        this.partiallySummarizedValues,
        physicalCapacity,
        0
      );
      this.setPartialValue(
        "TOTAL_SAVING_EFFECT",
        sasiRow,
        this.partiallySummarizedValues,
        physicalCapacity,
        1
      );
    });
    const result = this.summarizeStats(this.partiallySummarizedValues, "all");
    result.setValue("SELECTED_COUNT", amendFilter.length, "");
    return result;
  }

  summarizeStats(
    values: SystemAggregatedStatistics,
    name: string
  ): SystemAggregatedStatistics {
    const summarizedValues = new SystemAggregatedStatistics(name);
    this.setSummarizeValue("SUBSCRIBED_CAPACITY", values, summarizedValues);
    this.setSummarizeValue("PHYSICAL_CAPACITY", values, summarizedValues);
    this.setSummarizeValue("LOGICAL_CAPACITY", values, summarizedValues);
    this.setSummarizeValue("AVAILABLE_CAPACITY", values, summarizedValues);
    this.setSummarizeValue("LOGICAL_USED", values, summarizedValues);
    this.setSummarizeValue("LOGICAL_FREE", values, summarizedValues);
    this.setSummarizeValue("PHYSICAL_USED", values, summarizedValues);
    this.setSummarizeValue("PHYSICAL_FREE", values, summarizedValues);
    this.setSummarizeValue("NET_TOTAL", values, summarizedValues);
    this.setSummarizeValue("NET_USED", values, summarizedValues);
    this.setSummarizeValue("NET_FREE", values, summarizedValues);
    this.setSummarizeValue("CHANGE_DAY", values, summarizedValues);
    this.setSummarizeValue("CHANGE_WEEK", values, summarizedValues);
    this.setSummarizeValue("CHANGE_MONTH", values, summarizedValues);
    const physicalCapacitySummarized = this.getSafeValue(
      summarizedValues.getValue("PHYSICAL_CAPACITY")
    );
    this.setSummarizeValue(
      "PHYSICAL_SUBS_PERC",
      values,
      summarizedValues,
      physicalCapacitySummarized
    );
    this.setSummarizeValue(
      "LOGICAL_SUBS_PERC",
      values,
      summarizedValues,
      physicalCapacitySummarized
    );
    this.setSummarizeValue(
      "NET_SUBS_PERC",
      values,
      summarizedValues,
      physicalCapacitySummarized
    );
    this.setSummarizeValue(
      "LOGICAL_USED_PERC",
      values,
      summarizedValues,
      physicalCapacitySummarized
    );
    this.setSummarizeValue(
      "PHYSICAL_USED_PERC",
      values,
      summarizedValues,
      physicalCapacitySummarized
    );
    const netTotalSummarized = this.getSafeValue(
      summarizedValues.getValue("NET_TOTAL")
    );
    this.setSummarizeValue(
      "NET_USED_PERC",
      values,
      summarizedValues,
      netTotalSummarized
    );
    const compRatio =
      this.physicalCapacityCompRatio === 0 ? 1 : this.physicalCapacityCompRatio;
    this.setSummarizeValue(
      "COMPRESSION_RATIO",
      values,
      summarizedValues,
      compRatio
    );
    const dedupRatio =
      this.physicalCapacityDedupRatio === 0
        ? 1
        : this.physicalCapacityDedupRatio;
    this.setSummarizeValue("DEDUP_RATIO", values, summarizedValues, dedupRatio);
    const totalSaving =
      this.physicalCapacityTotalSaving === 0
        ? 1
        : this.physicalCapacityTotalSaving;
    this.setSummarizeValue(
      "TOTAL_SAVING_EFFECT",
      values,
      summarizedValues,
      totalSaving
    );
    return summarizedValues;
  }

  getMetricByName(metrics: SasiRow, type: SystemMetricType): SasiCell {
    const metric = metrics.getCell(type);
    if (metric === null) {
      return null;
    }
    return metric;
  }

  getMetricValueByName(metrics: SasiRow, type: SystemMetricType) {
    const metric = this.getMetricByName(metrics, type);
    if (metric == null) {
      return null;
    }
    return Number(metric.value);
  }

  setPartialValue(
    metricType: SystemMetricType,
    values: SasiRow,
    summarizeValue,
    meanValue = 1,
    minimalValue = null
  ) {
    const metric = this.getMetricByName(values, metricType);
    let computedValue = 0;
    if (metric !== null) {
      if (minimalValue === null || metric.value > minimalValue) {
        if (metricType === "COMPRESSION_RATIO") {
          this.physicalCapacityCompRatio += meanValue;
        }
        if (metricType === "DEDUP_RATIO") {
          this.physicalCapacityDedupRatio += meanValue;
        }
        if (metricType === "TOTAL_SAVING_EFFECT") {
          this.physicalCapacityTotalSaving += meanValue;
        }
        computedValue = Number(metric.value) * meanValue;
      } else {
        computedValue = 0;
      }

      summarizeValue.setValue(metricType, computedValue, metric.rawData.unit);
    }
  }

  setSummarizeValue(
    metricType: SystemMetricType,
    values: SystemAggregatedStatistics,
    summarizedValue,
    meanValue = null
  ) {
    const metric = values.getValue(metricType);
    if (metric !== undefined) {
      if (meanValue != null) {
        summarizedValue.setValue(
          metricType,
          metric.value / meanValue,
          metric.unit
        );
      } else {
        summarizedValue.setValue(metricType, metric.value, metric.unit);
      }
    }
  }

  getSafeValue(metric: Metric) {
    if (metric === undefined) {
      return 0;
    }
    return metric.value;
  }
}
