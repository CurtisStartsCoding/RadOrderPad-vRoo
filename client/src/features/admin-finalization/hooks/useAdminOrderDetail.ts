import { useOrderDetail } from './useOrderDetail';
import { useEmrProcessing } from './useEmrProcessing';
import { useSupplementalDocs } from './useSupplementalDocs';
import { usePatientInfoEditor } from './usePatientInfoEditor';
import { useInsuranceInfoEditor } from './useInsuranceInfoEditor';
import { useOrderFinalization } from './useOrderFinalization';

/**
 * Compatibility hook that combines all the smaller hooks
 * 
 * This hook is provided for backward compatibility with existing code.
 * For new code, it's recommended to use the more focused hooks directly.
 */
export const useAdminOrderDetail = (orderId: string) => {
  // Use all the smaller hooks
  const orderDetail = useOrderDetail(orderId);
  const emrProcessing = useEmrProcessing(orderId);
  const supplementalDocs = useSupplementalDocs(orderId);
  const patientInfoEditor = usePatientInfoEditor(orderId);
  const insuranceInfoEditor = useInsuranceInfoEditor(orderId);
  const orderFinalization = useOrderFinalization(orderId);
  
  // Combine all the hooks' return values
  return {
    // From useOrderDetail
    orderData: orderDetail.orderData,
    isLoadingOrder: orderDetail.isLoadingOrder,
    isOrderError: orderDetail.isOrderError,
    orderError: orderDetail.orderError,
    refetchOrder: orderDetail.refetchOrder,
    
    // From useEmrProcessing
    emrPasteText: emrProcessing.emrPasteText,
    setEmrPasteText: emrProcessing.setEmrPasteText,
    processEmrPaste: emrProcessing.processEmrPaste,
    isProcessingEmr: emrProcessing.isProcessingEmr,
    
    // From useSupplementalDocs
    supplementalPasteText: supplementalDocs.supplementalPasteText,
    setSupplementalPasteText: supplementalDocs.setSupplementalPasteText,
    processSupplementalDoc: supplementalDocs.processSupplementalDoc,
    isProcessingSupplemental: supplementalDocs.isProcessingSupplemental,
    
    // From usePatientInfoEditor
    isEditingPatient: patientInfoEditor.isEditingPatient,
    setIsEditingPatient: patientInfoEditor.setIsEditingPatient,
    updatePatientInfo: patientInfoEditor.updatePatientInfo,
    isUpdatingPatient: patientInfoEditor.isUpdatingPatient,
    
    // From useInsuranceInfoEditor
    isEditingInsurance: insuranceInfoEditor.isEditingInsurance,
    setIsEditingInsurance: insuranceInfoEditor.setIsEditingInsurance,
    updateInsuranceInfo: insuranceInfoEditor.updateInsuranceInfo,
    isUpdatingInsurance: insuranceInfoEditor.isUpdatingInsurance,
    
    // From useOrderFinalization
    sendToRadiology: orderFinalization.sendToRadiology,
    isSendingToRadiology: orderFinalization.isSendingToRadiology,
    canSendToRadiology: orderFinalization.canSendToRadiology
  };
};