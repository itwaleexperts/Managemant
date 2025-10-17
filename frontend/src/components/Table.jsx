export default function Table({ title, columns, data }) {
  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="border p-2 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {Object.values(row).map((val, j) => (
                <td key={j} className="border p-2">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
