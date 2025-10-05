/**
 * Export chart data to CSV format
 */
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export chart as image (requires html2canvas)
 * For now, we'll provide the data export option
 */
export function prepareChartDataForExport(chartData: any[], chartName: string) {
  return {
    name: chartName,
    data: chartData,
    exportDate: new Date().toISOString().split('T')[0],
  };
}
