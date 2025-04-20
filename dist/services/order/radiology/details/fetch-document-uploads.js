import { queryPhiDb } from '../../../../config/db';
/**
 * Fetch document uploads for an order
 * @param orderId Order ID
 * @returns Array of document uploads
 */
export async function fetchDocumentUploads(orderId) {
    const documentUploadsResult = await queryPhiDb(`SELECT du.id, du.document_type, du.filename, du.file_path, du.mime_type, du.uploaded_at
     FROM document_uploads du
     WHERE du.order_id = $1
     ORDER BY du.uploaded_at DESC`, [orderId]);
    return documentUploadsResult.rows;
}
//# sourceMappingURL=fetch-document-uploads.js.map