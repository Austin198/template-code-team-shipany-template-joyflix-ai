import {
  COMPARISON_COLUMNS,
  COMPARISON_FOOTNOTE,
  COMPARISON_ROWS,
} from '@/config/seo-landings';

export function ComparisonTable() {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-border border-b">
              {COMPARISON_COLUMNS.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-3 py-2 font-semibold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.tool} className="border-border border-b">
                <th scope="row" className="px-3 py-2 font-medium">
                  {row.tool}
                </th>
                {row.cells.map((cell, index) => (
                  <td key={`${row.tool}-${index}`} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground mt-3 text-sm">
        {COMPARISON_FOOTNOTE}
      </p>
    </div>
  );
}
