import { Injectable } from '@angular/core';
import { TableColumn } from '../components/shared/base-table/base-table.config';

/**
 * CSV Export Service
 * Provides standardized CSV export functionality for tables
 */
@Injectable({
  providedIn: 'root'
})
export class CsvExportService {

  /**
   * Export table data to CSV file
   * @param data Array of data objects to export
   * @param columns Column definitions (determines which fields to export and headers)
   * @param filename Name of the downloaded CSV file (without .csv extension)
   */
  exportToCsv<T>(data: T[], columns: TableColumn[], filename: string): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Build CSV content
    const csvContent = this.buildCsvContent(data, columns);

    // Create blob and trigger download
    this.downloadCsv(csvContent, filename);
  }

  /**
   * Build CSV content string from data and columns
   */
  private buildCsvContent<T>(data: T[], columns: TableColumn[]): string {
    // Create header row
    const headers = columns
      .filter(col => !col.hidden && col.type !== 'actions')
      .map(col => this.escapeCsvValue(col.header))
      .join(',');

    // Create data rows
    const rows = data.map(row => {
      return columns
        .filter(col => !col.hidden && col.type !== 'actions')
        .map(col => {
          const value = this.getNestedValue(row, col.field);
          return this.escapeCsvValue(this.formatValue(value, col));
        })
        .join(',');
    });

    return [headers, ...rows].join('\n');
  }

  /**
   * Get nested object value using dot notation (e.g., "address.city")
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  /**
   * Format value based on column type
   */
  private formatValue(value: any, column: TableColumn): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Handle custom cell types that need special formatting
    if (column.type === 'custom') {
      // For custom cells, return the raw value or JSON if complex
      if (typeof value === 'object' && !Array.isArray(value)) {
        return JSON.stringify(value);
      }
      if (Array.isArray(value)) {
        // For arrays (like circuit health), extract meaningful info
        return value.map(item => {
          if (typeof item === 'object' && item.status) {
            return item.status;
          }
          return item;
        }).join('; ');
      }
    }

    // Handle dates
    if (column.type === 'date' && value instanceof Date) {
      return value.toISOString().split('T')[0];
    }

    // Handle numbers
    if (column.type === 'number' && typeof value === 'number') {
      return value.toString();
    }

    // Default: convert to string
    return String(value);
  }

  /**
   * Escape CSV value (handle quotes, commas, newlines)
   */
  private escapeCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    const stringValue = String(value);

    // If value contains comma, quote, or newline, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }

  /**
   * Trigger browser download of CSV file
   */
  private downloadCsv(csvContent: string, filename: string): void {
    // Add BOM for Excel UTF-8 support
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  }
}
