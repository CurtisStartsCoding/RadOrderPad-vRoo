import { OrderDetails } from '../../types';
/**
 * Configuration options for CSV export
 */
interface CsvExportOptions {
    includeHeaders?: boolean;
    delimiter?: string;
    quoteFields?: boolean;
}
/**
 * Generate CSV export of order data
 * @param orderDetails Order details object
 * @param options CSV export options
 * @returns CSV string
 */
export declare function generateCsvExport(orderDetails: OrderDetails, options?: CsvExportOptions): string;
export default generateCsvExport;
