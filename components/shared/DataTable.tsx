import React from 'react';
import styles from './DataTable.module.css';
import EmptyState from './EmptyState';

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

export default function DataTable({ columns, data, emptyMessage = 'No data available' }: DataTableProps) {
  if (data.length === 0) {
    return <EmptyState title={emptyMessage} description="Try adjusting your filters." />;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                 </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}