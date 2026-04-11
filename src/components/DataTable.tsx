type Column = {
  key: string;
  label: string;
  className?: string;
};

type Props = {
  columns: Column[];
  rows: Record<string, React.ReactNode>[];
};

export default function DataTable({ columns, rows }: Props) {
  return (
    <div className="rounded-xl border border-line overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-identity text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-5 text-left font-semibold ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="bg-card border-b border-line last:border-b-0"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-4 px-5 align-top ${col.className ?? ""}`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
