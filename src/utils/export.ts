export function exportData(data: any[], format: 'csv' | 'json') {
  let content: string;
  let type: string;
  let extension: string;

  if (format === 'csv') {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    content = [headers, ...rows].join('\n');
    type = 'text/csv';
    extension = 'csv';
  } else {
    content = JSON.stringify(data, null, 2);
    type = 'application/json';
    extension = 'json';
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sensor-data.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}