import { SystemMetricType } from "../../common/models/metrics/system-metric-type.enum";

class AggregatedStatistics {
  physicalSubstitution = 0;
  physicalCapacity = 0;
  availableCapacity = 0;
  logicalUsed = 0;
  physicalUsed = 0;
  compressionRatio = 0;
  capacityChanged1D = 0;
  capacityChanged1W = 0;
  capacityChanged1M = 0;
}

export class SystemAggregatedStatistics extends AggregatedStatistics {
  system = null;
  subscriptionCapacity = 0;
  physicalSubstitution = 0;
  physicalCapacity = 0;
  availableCapacity = 0;
  logicalCapacity = 0;
  logicalUsed = 0;
  logicalFree = 0;
  physicalUsedPerc = 0;
  physicalUsed = 0;
  physicalFree = 0;
  compressionRatio = 0;
  capacityChanged1D = 0;
  capacityChanged1W = 0;
  capacityChanged1M = 0;
  logicalSubstitution = 0;
  logicalUsedPerc = 0;
  netSubstitution = 0;
  netTotal = 0;
  netUsed = 0;
  netFree = 0;
  netUsedPerc = 0;
  dedupRatio = 0;
  totalSaving = 0;

  constructor(systemName: string) {
    super();
    this.system = systemName;
  }

  getValue(name: SystemMetricType) {
    switch (name) {
      case "SUBSCRIBED_CAPACITY":
        return this.subscriptionCapacity;
      case "PHYSICAL_SUBS_PERC":
        return this.physicalSubstitution;
      case "LOGICAL_SUBS_PERC":
        return this.logicalSubstitution;
      case "PHYSICAL_CAPACITY":
        return this.physicalCapacity;
      case "LOGICAL_CAPACITY":
        return this.physicalCapacity;
      case "AVAILABLE_CAPACITY":
        return this.availableCapacity;
      case "LOGICAL_USED":
        return this.logicalUsed;
      case "LOGICAL_FREE":
        return this.logicalFree;
      case "PHYSICAL_USED":
        return this.physicalUsed;
      case "PHYSICAL_FREE":
        return this.physicalFree;
      case "PHYSICAL_USED_PERC":
        return this.physicalUsedPerc;
      case "COMPRESSION_RATIO":
        return this.compressionRatio;
      case "CHANGE_DAY":
        return this.capacityChanged1D;
      case "CHANGE_WEEK":
        return this.capacityChanged1W;
      case "CHANGE_MONTH":
        return this.capacityChanged1M;
      case "LOGICAL_USED_PERC":
        return this.logicalUsedPerc;
      case "NET_SUBS_PERC":
        return this.netSubstitution;
      case "NET_TOTAL":
        return this.netTotal;
      case "NET_USED":
        return this.netUsed;
      case "NET_FREE":
        return this.netFree;
      case "NET_USED_PERC":
        return this.netUsedPerc;
      case "DEDUP_RATIO":
        return this.dedupRatio;
      case "TOTAL_SAVING_EFFECT":
        return this.totalSaving;
    }
  }
}
