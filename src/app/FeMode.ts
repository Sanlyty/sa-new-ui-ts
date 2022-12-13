type FeModeReport = {
  mode: "hp" | "emc";
  map: Record<string, string[]>;
};

const feMode = (async () => {
  return (await fetch("/api/v2/compat/FeMode").then((r) =>
    r.json()
  )) as FeModeReport;
})();

export default feMode;
