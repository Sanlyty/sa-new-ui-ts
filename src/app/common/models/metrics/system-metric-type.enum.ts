export type SystemMetricType =
  | "SELECTED_COUNT"
  | "PHYSICAL_CAPACITY"
  | "PHYSICAL_SUBS_PERC"
  | "AVAILABLE_CAPACITY"
  | "LOGICAL_USED_PERC"
  | "PHYSICAL_USED_PERC"
  | "PHYSICAL_USED"
  | "PHYSICAL_FREE"
  | "LOGICAL_CAPACITY"
  | "LOGICAL_USED"
  | "LOGICAL_FREE"
  | "NET_TOTAL"
  | "NET_USED"
  | "NET_FREE"
  | "NET_USED_PERC"
  | "COMPRESSION_RATIO"
  | "DEDUP_RATIO"
  | "TOTAL_SAVING_EFFECT"
  | "WORKLOAD"
  | "RESPONSE"
  | "RESPONSE_WRITE"
  | "TRANSFER"
  | "HDD_PERC"
  | "CPU_PERC"
  | "WRITE_PENDING_PERC"
  | "SLA_EVENTS"
  | "OUT_OF_SLA_TIME"
  | "IMBALANCE_EVENTS"
  | "PREDICTION_L1"
  | "PREDICTION_L2"
  | "PREDICTION_L3"
  | "CHANGE_DAY"
  | "CHANGE_WEEK"
  | "CHANGE_MONTH"
  | "IMBALANCE_PERC"
  | "IMBALANCE_ABSOLUT"
  | "NET_SUBS_PERC"
  | "LOGICAL_SUBS_PERC"
  | "SUBSCRIBED_CAPACITY"
  | "PORT_IMBALANCE_EVENTS"
  | "PORT_IMBALANCE_PERC"
  | "PORT_IMBALANCE_ABSOLUT"
  // Counted in SA UI
  | "LOGICAL_CHANGE_MONTH"
  // Mocked extarnal type for metric type,
  | "TIER"
  | "PARITY_GROUP_NAME"
  | "DURATION";
