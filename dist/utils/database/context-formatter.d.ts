import { ICD10Row, CPTRow, MappingRow, MarkdownRow } from './types';
/**
 * Format database context from query results
 */
export declare function formatDatabaseContext(icd10Rows: ICD10Row[], cptRows: CPTRow[], mappingRows: MappingRow[], markdownRows: MarkdownRow[]): string;
