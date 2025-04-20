/**
 * Validate request for presigned URL generation
 */
export function validatePresignedUrlRequest(req, res) {
    const { fileType, fileName, contentType, fileSize } = req.body;
    // Validate required fields
    if (!fileType || !fileName || !contentType) {
        res.status(400).json({
            success: false,
            message: 'Missing required fields: fileType, fileName, or contentType'
        });
        return false;
    }
    // Validate file size if provided
    if (fileSize) {
        const maxSizeBytes = fileType === 'application/pdf'
            ? 20 * 1024 * 1024 // 20MB for PDFs
            : 5 * 1024 * 1024; // 5MB for other files
        if (fileSize > maxSizeBytes) {
            res.status(400).json({
                success: false,
                message: `File size (${Math.round(fileSize / (1024 * 1024))}MB) exceeds the maximum allowed size (${Math.round(maxSizeBytes / (1024 * 1024))}MB)`
            });
            return false;
        }
    }
    // Validate file type
    const allowedFileTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'application/pdf',
        'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedFileTypes.includes(contentType)) {
        res.status(400).json({
            success: false,
            message: `File type ${contentType} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`
        });
        return false;
    }
    return true;
}
//# sourceMappingURL=validate-presigned-url-request.js.map