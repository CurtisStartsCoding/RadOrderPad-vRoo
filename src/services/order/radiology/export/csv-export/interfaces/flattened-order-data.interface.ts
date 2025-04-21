import { OrderInfo } from './order-info.interface';
import { PatientInfo } from './patient-info.interface';
import { InsuranceInfo } from './insurance-info.interface';
import { ReferringInfo } from './referring-info.interface';
import { RadiologyInfo } from './radiology-info.interface';
import { ClinicalRecordsInfo } from './clinical-records-info.interface';
import { ValidationInfo } from './validation-info.interface';

/**
 * Interface for flattened order data in CSV export
 * Combines all the domain-specific interfaces
 */
export interface FlattenedOrderData extends 
  OrderInfo,
  PatientInfo,
  InsuranceInfo,
  ReferringInfo,
  RadiologyInfo,
  ClinicalRecordsInfo,
  ValidationInfo {
  
  // Allow for additional dynamic fields
  [key: string]: string | number | boolean | undefined;
}