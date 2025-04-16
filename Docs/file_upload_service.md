# File Upload Service

**Version:** 1.0
**Date:** 2025-04-11

This document specifies the mechanism for handling user file uploads securely to AWS S3.

---

## 1. Purpose

-   To allow users (primarily `admin_staff`) to upload supporting documents related to an order or patient (e.g., insurance cards, prior reports, lab results).
-   To store physician signatures captured via the `SignaturePad` component.
-   To ensure uploads are secure, associated with the correct context (patient/order), and stored reliably.

## 2. Architecture: Presigned URLs

RadOrderPad uses the **presigned URL** pattern for S3 uploads to enhance security and performance.

-   **Flow:**
    1.  **Client Request:** The frontend client (when a user selects a file or saves a signature) makes an API request to the RadOrderPad backend (e.g., `POST /api/uploads/presigned-url`). The request includes metadata like the intended `filename`, `fileType` (MIME type), `context` ('order' or 'patient'), and the relevant `order_id` or `patient_id`.
    2.  **Backend Authorization & URL Generation:**
        *   The backend verifies the user is authenticated and authorized to upload a file for the given context (order/patient).
        *   It generates a unique key (path) within the designated S3 bucket where the file will be stored (e.g., `uploads/{organization_id}/{order_id_or_patient_id}/{uuid}_{filename}`).
        *   Using the AWS SDK, the backend generates a short-lived (e.g., 5-15 minutes) S3 presigned URL that grants temporary `PUT` permission for the specific generated key.
        *   The backend returns the `presignedUrl` and the `filePath` (the S3 key) to the client.
    3.  **Client Upload:** The frontend client uses the received `presignedUrl` to upload the file *directly* to S3 via an HTTP `PUT` request, including necessary headers like `Content-Type`. The backend is not involved in proxying the file data.
    4.  **Backend Confirmation:** After the direct S3 upload is successful (client receives HTTP 200 from S3), the client makes a second API call to the backend (e.g., `POST /api/uploads/confirm`) sending the `filePath`, `fileSize`, `document_type`, and original context (`order_id`/`patient_id`).
    5.  **Database Record:** The backend confirmation handler creates a record in the `document_uploads` table (PHI DB) linking the `filePath` (S3 key) to the relevant user, order, or patient, and storing other metadata.

-   **Benefits:**
    *   **Security:** The backend controls access and generates temporary, scoped credentials. S3 bucket can remain private. Backend credentials are not exposed to the client.
    *   **Scalability:** Upload traffic goes directly to S3, offloading the backend API servers.
    *   **Performance:** Often faster uploads as data doesn't pass through the backend application server.

## 3. S3 Bucket Configuration

-   **Bucket:** A dedicated S3 bucket (e.g., `radorderpad-uploads-prod`).
-   **Permissions:** Bucket policy should generally block public access. Access granted via IAM roles (for backend to generate presigned URLs) and the temporary presigned URLs themselves.
-   **CORS:** Configure CORS on the bucket to allow `PUT` requests from the frontend application's origin domain(s). Specify allowed headers (e.g., `Content-Type`).
-   **Encryption:** Enable Server-Side Encryption (SSE-S3 or SSE-KMS).
-   **Versioning (Recommended):** Enable object versioning for recovery purposes.
-   **Lifecycle Policies (Optional):** Configure rules to transition older uploads to cheaper storage tiers (e.g., Glacier) or delete them after a defined period, based on compliance requirements.

## 4. Database Table (`document_uploads` - PHI DB)

| Column              | Type                        | Constraints                   | Description                                          |
| ------------------- | --------------------------- | ----------------------------- | ---------------------------------------------------- |
| `id`                | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key for the upload record                    |
| `user_id`           | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.users.id` (Uploader)    |
| `order_id`          | `integer`                   | `FK REFERENCES orders(id)`      | Link to order if applicable                          |
| `patient_id`        | `integer`                   | `FK REFERENCES patients(id)`    | Link to patient if applicable                        |
| `document_type`     | `text`                      | `NOT NULL`                    | User-defined or system type ('insurance_card', 'lab_report', 'signature', 'prior_imaging', 'supplemental') |
| `filename`          | `text`                      | `NOT NULL`                    | Original filename provided by the user               |
| `file_path`         | `text`                      | `NOT NULL`, `UNIQUE`          | The full key/path of the object in the S3 bucket     |
| `file_size`         | `integer`                   | `NOT NULL`                    | File size in bytes                                   |
| `mime_type`         | `text`                      |                               | File MIME type (e.g., 'image/png', 'application/pdf') |
| `processing_status` | `text`                      | `DEFAULT 'uploaded'`          | Status ('uploaded', 'processing', 'processed', 'failed') |
| `processing_details`| `text`                      |                               | Notes from any post-upload processing (e.g., OCR)    |
| `content_extracted` | `text`                      |                               | Extracted text content (optional)                    |
| `uploaded_at`       | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp of successful upload confirmation        |

## 5. Considerations

-   **File Size Limits:** Enforce limits both on the client-side and potentially via S3 policies or Lambda checks.
-   **Allowed File Types:** Restrict uploads to specific MIME types or extensions relevant to the application (e.g., PDF, JPG, PNG).
-   **Virus Scanning (Recommended):** Integrate a virus scanning solution (e.g., third-party service triggered by S3 events) for uploaded files.
-   **Viewing Files:** Accessing uploaded files should also use presigned GET URLs generated by the backend upon authorization checks.

---

## Data References

-   `document_uploads` (PHI DB)
-   `orders` (PHI DB)
-   `patients` (PHI DB)
-   `users` (Main DB)
-   AWS S3 API (External)
-   AWS SDK (Backend)