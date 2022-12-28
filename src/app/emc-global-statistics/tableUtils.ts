import { SasiColumnBuilder } from "../common/components/sasi-table/sasi-table.component";
import { UnitFormatterComponent } from "../global-statistics/formatters/unit-formatter/unit-formatter.component";

export type ColDef = {
  id: string;
  label: string;
  altLabel?: string;
  altSort?: boolean;
  tooltip?: string;
  formatterComponent?: any;
  altBorder?: boolean;
  isAggregated?: boolean;
  aggComponent?: any;
};

export const quickCol = (
  id: string,
  label: string,
  opts: Partial<Omit<ColDef, "id" | "label">> = {}
): ColDef => ({
  id,
  label,
  ...opts,
});

export const buildCol =
  (opts: { formatter?: any } = {}) =>
  (obj: ColDef) =>
    SasiColumnBuilder.getInstance()
      .withIndex(obj.id)
      .withLabel(obj.label)
      .withAltLabel(obj.altLabel)
      .withTooltipText(`${obj.label} Average`)
      .withColumnTooltipText(obj.tooltip)
      .withAggComponent(obj.aggComponent)
      .withComponent(
        obj.formatterComponent ?? opts.formatter ?? UnitFormatterComponent
      )
      .withAltSortEnable(obj.altSort ?? false)
      .withAltBorder(obj.altBorder ?? false)
      .withIsAggregated(obj.isAggregated ?? false)
      .build();
