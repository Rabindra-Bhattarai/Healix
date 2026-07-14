export type ResultFlag = "NORMAL" | "HIGH" | "LOW" | "OPTIMAL";

export interface LabRow {
  testName: string;
  result: string;
  flag: ResultFlag;
  referenceRange: string;
  units: string;
}

export interface LabResultsTableColumns {
  testName: string;
  result: string;
  referenceRange: string;
  units: string;
}

const FLAG_CLASSES: Record<ResultFlag, string> = {
  NORMAL: "bg-secondary/10 text-secondary border-secondary/20",
  OPTIMAL: "bg-tertiary/10 text-tertiary border-tertiary/20",
  HIGH: "bg-error/10 text-error border-error/20",
  LOW: "bg-error/10 text-error border-error/20",
};

export default function LabResultsTable({
  title,
  subtitle,
  rows,
  columns,
  showFlag = true,
}: {
  title: string;
  subtitle: string;
  rows: LabRow[];
  columns?: LabResultsTableColumns;
  showFlag?: boolean;
}) {
  const cols = columns ?? {
    testName: "Test Name",
    result: "Result",
    referenceRange: "Reference Range",
    units: "Units",
  };
  const headers = [cols.testName, cols.result, ...(showFlag ? ["Flag"] : []), cols.referenceRange, cols.units];

  return (
    <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
      <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h3 className="font-h3 text-h3 text-on-surface">{title}</h3>
        <span className="font-label-sm text-label-sm text-on-surface-variant">{subtitle}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-bright/50">
            <tr>
              {headers.map((head) => (
                <th
                  key={head}
                  className="px-6 py-4 font-label-sm text-label-sm text-outline uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {rows.map((row) => (
              <tr key={row.testName} className="hover:bg-surface-container-lowest transition-colors">
                <td className="px-6 py-4 font-body-md text-on-surface font-medium">
                  {row.testName}
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface">{row.result}</td>
                {showFlag && (
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${FLAG_CLASSES[row.flag]}`}
                    >
                      {row.flag}
                    </span>
                  </td>
                )}
                <td className="px-6 py-4 font-body-md text-on-surface-variant">
                  {row.referenceRange}
                </td>
                <td className="px-6 py-4 font-body-md text-on-surface-variant">{row.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
