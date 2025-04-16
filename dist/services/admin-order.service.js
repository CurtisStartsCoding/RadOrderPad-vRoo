"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const models_1 = require("../models");
/**
 * Service for handling admin order operations
 */
class AdminOrderService {
    /**
     * Handle pasted EMR summary
     * @param orderId Order ID
     * @param pastedText Pasted EMR summary text
     * @param userId User ID
     * @returns Promise with result
     */
    async handlePasteSummary(orderId, pastedText, userId) {
        // Get a client for transaction
        const client = await (0, db_1.getPhiDbClient)();
        try {
            // Start transaction
            await client.query('BEGIN');
            // 1. Verify order exists and has status 'pending_admin'
            const orderResult = await client.query(`SELECT o.id, o.status, o.patient_id, o.referring_organization_id 
         FROM orders o
         WHERE o.id = $1`, [orderId]);
            if (orderResult.rows.length === 0) {
                throw new Error(`Order ${orderId} not found`);
            }
            const order = orderResult.rows[0];
            if (order.status !== models_1.OrderStatus.PENDING_ADMIN) {
                throw new Error(`Order ${orderId} is not in pending_admin status`);
            }
            // 2. Save the raw pasted text to patient_clinical_records
            await client.query(`INSERT INTO patient_clinical_records
         (patient_id, order_id, record_type, content, added_by_user_id)
         VALUES ($1, $2, $3, $4, $5)`, [order.patient_id, orderId, 'emr_summary_paste', pastedText, userId]);
            // 3. Parse the text to extract patient demographics and insurance details
            // This is a simple implementation that could be enhanced with more sophisticated NLP
            const parsedData = this.parseEmrSummary(pastedText);
            // 4. Update patient information with extracted data
            if (parsedData.patientInfo) {
                const patientUpdateFields = [];
                const patientUpdateValues = [];
                let valueIndex = 1;
                if (parsedData.patientInfo.address) {
                    patientUpdateFields.push(`address_line1 = $${valueIndex}`);
                    patientUpdateValues.push(parsedData.patientInfo.address);
                    valueIndex++;
                }
                if (parsedData.patientInfo.city) {
                    patientUpdateFields.push(`city = $${valueIndex}`);
                    patientUpdateValues.push(parsedData.patientInfo.city);
                    valueIndex++;
                }
                if (parsedData.patientInfo.state) {
                    patientUpdateFields.push(`state = $${valueIndex}`);
                    patientUpdateValues.push(parsedData.patientInfo.state);
                    valueIndex++;
                }
                if (parsedData.patientInfo.zipCode) {
                    patientUpdateFields.push(`zip_code = $${valueIndex}`);
                    patientUpdateValues.push(parsedData.patientInfo.zipCode);
                    valueIndex++;
                }
                if (parsedData.patientInfo.phone) {
                    patientUpdateFields.push(`phone_number = $${valueIndex}`);
                    patientUpdateValues.push(parsedData.patientInfo.phone);
                    valueIndex++;
                }
                if (parsedData.patientInfo.email) {
                    patientUpdateFields.push(`email = $${valueIndex}`);
                    patientUpdateValues.push(parsedData.patientInfo.email);
                    valueIndex++;
                }
                if (patientUpdateFields.length > 0) {
                    const patientUpdateQuery = `
            UPDATE patients
            SET ${patientUpdateFields.join(', ')}, updated_at = NOW()
            WHERE id = $${valueIndex}
          `;
                    await client.query(patientUpdateQuery, [...patientUpdateValues, order.patient_id]);
                }
            }
            // 5. Create/Update insurance information with extracted data
            if (parsedData.insuranceInfo) {
                // Check if insurance record already exists
                const insuranceResult = await client.query(`SELECT id FROM patient_insurance WHERE patient_id = $1 AND is_primary = true`, [order.patient_id]);
                if (insuranceResult.rows.length > 0) {
                    // Update existing insurance record
                    const insuranceId = insuranceResult.rows[0].id;
                    const insuranceUpdateFields = [];
                    const insuranceUpdateValues = [];
                    let valueIndex = 1;
                    if (parsedData.insuranceInfo.insurerName) {
                        insuranceUpdateFields.push(`insurer_name = $${valueIndex}`);
                        insuranceUpdateValues.push(parsedData.insuranceInfo.insurerName);
                        valueIndex++;
                    }
                    if (parsedData.insuranceInfo.policyNumber) {
                        insuranceUpdateFields.push(`policy_number = $${valueIndex}`);
                        insuranceUpdateValues.push(parsedData.insuranceInfo.policyNumber);
                        valueIndex++;
                    }
                    if (parsedData.insuranceInfo.groupNumber) {
                        insuranceUpdateFields.push(`group_number = $${valueIndex}`);
                        insuranceUpdateValues.push(parsedData.insuranceInfo.groupNumber);
                        valueIndex++;
                    }
                    if (parsedData.insuranceInfo.policyHolderName) {
                        insuranceUpdateFields.push(`policy_holder_name = $${valueIndex}`);
                        insuranceUpdateValues.push(parsedData.insuranceInfo.policyHolderName);
                        valueIndex++;
                    }
                    if (insuranceUpdateFields.length > 0) {
                        const insuranceUpdateQuery = `
              UPDATE patient_insurance
              SET ${insuranceUpdateFields.join(', ')}, updated_at = NOW()
              WHERE id = $${valueIndex}
            `;
                        await client.query(insuranceUpdateQuery, [...insuranceUpdateValues, insuranceId]);
                    }
                }
                else if (parsedData.insuranceInfo.insurerName && parsedData.insuranceInfo.policyNumber) {
                    // Create new insurance record
                    await client.query(`INSERT INTO patient_insurance
             (patient_id, is_primary, insurer_name, policy_number, group_number, policy_holder_name)
             VALUES ($1, $2, $3, $4, $5, $6)`, [
                        order.patient_id,
                        true,
                        parsedData.insuranceInfo.insurerName,
                        parsedData.insuranceInfo.policyNumber,
                        parsedData.insuranceInfo.groupNumber || null,
                        parsedData.insuranceInfo.policyHolderName || null
                    ]);
                }
            }
            // Commit transaction
            await client.query('COMMIT');
            return {
                success: true,
                orderId,
                message: 'EMR summary processed successfully',
                parsedData
            };
        }
        catch (error) {
            // Rollback transaction on error
            await client.query('ROLLBACK');
            console.error('Error in handlePasteSummary:', error);
            throw error;
        }
        finally {
            // Release client back to pool
            client.release();
        }
    }
    /**
     * Handle pasted supplemental documents
     * @param orderId Order ID
     * @param pastedText Pasted supplemental text
     * @param userId User ID
     * @returns Promise with result
     */
    async handlePasteSupplemental(orderId, pastedText, userId) {
        try {
            // 1. Verify order exists and has status 'pending_admin'
            const orderResult = await (0, db_1.queryPhiDb)(`SELECT o.id, o.status, o.patient_id 
         FROM orders o
         WHERE o.id = $1`, [orderId]);
            if (orderResult.rows.length === 0) {
                throw new Error(`Order ${orderId} not found`);
            }
            const order = orderResult.rows[0];
            if (order.status !== models_1.OrderStatus.PENDING_ADMIN) {
                throw new Error(`Order ${orderId} is not in pending_admin status`);
            }
            // 2. Save the raw pasted text to patient_clinical_records
            await (0, db_1.queryPhiDb)(`INSERT INTO patient_clinical_records
         (patient_id, order_id, record_type, content, added_by_user_id)
         VALUES ($1, $2, $3, $4, $5)`, [order.patient_id, orderId, 'supplemental_docs_paste', pastedText, userId]);
            return {
                success: true,
                orderId,
                message: 'Supplemental documents saved successfully'
            };
        }
        catch (error) {
            console.error('Error in handlePasteSupplemental:', error);
            throw error;
        }
    }
    /**
     * Update patient information
     * @param orderId Order ID
     * @param patientData Patient data
     * @param userId User ID
     * @returns Promise with result
     */
    async updatePatientInfo(orderId, patientData, userId) {
        try {
            // 1. Verify order exists and has status 'pending_admin'
            const orderResult = await (0, db_1.queryPhiDb)(`SELECT o.id, o.status, o.patient_id 
         FROM orders o
         WHERE o.id = $1`, [orderId]);
            if (orderResult.rows.length === 0) {
                throw new Error(`Order ${orderId} not found`);
            }
            const order = orderResult.rows[0];
            if (order.status !== models_1.OrderStatus.PENDING_ADMIN) {
                throw new Error(`Order ${orderId} is not in pending_admin status`);
            }
            // 2. Update patient information
            const updateFields = [];
            const updateValues = [];
            let valueIndex = 1;
            // Map patientData fields to database columns
            const fieldMap = {
                firstName: 'first_name',
                lastName: 'last_name',
                middleName: 'middle_name',
                dateOfBirth: 'date_of_birth',
                gender: 'gender',
                addressLine1: 'address_line1',
                addressLine2: 'address_line2',
                city: 'city',
                state: 'state',
                zipCode: 'zip_code',
                phoneNumber: 'phone_number',
                email: 'email',
                mrn: 'mrn'
            };
            // Build update query dynamically based on provided fields
            for (const [key, value] of Object.entries(patientData)) {
                if (fieldMap[key] && value !== undefined) {
                    updateFields.push(`${fieldMap[key]} = $${valueIndex}`);
                    updateValues.push(value);
                    valueIndex++;
                }
            }
            if (updateFields.length === 0) {
                throw new Error('No valid patient fields provided for update');
            }
            // Add updated_at field
            updateFields.push(`updated_at = NOW()`);
            const updateQuery = `
        UPDATE patients
        SET ${updateFields.join(', ')}
        WHERE id = $${valueIndex}
        RETURNING id
      `;
            const result = await (0, db_1.queryPhiDb)(updateQuery, [...updateValues, order.patient_id]);
            return {
                success: true,
                orderId,
                patientId: result.rows[0].id,
                message: 'Patient information updated successfully'
            };
        }
        catch (error) {
            console.error('Error in updatePatientInfo:', error);
            throw error;
        }
    }
    /**
     * Update insurance information
     * @param orderId Order ID
     * @param insuranceData Insurance data
     * @param userId User ID
     * @returns Promise with result
     */
    async updateInsuranceInfo(orderId, insuranceData, userId) {
        try {
            // 1. Verify order exists and has status 'pending_admin'
            const orderResult = await (0, db_1.queryPhiDb)(`SELECT o.id, o.status, o.patient_id 
         FROM orders o
         WHERE o.id = $1`, [orderId]);
            if (orderResult.rows.length === 0) {
                throw new Error(`Order ${orderId} not found`);
            }
            const order = orderResult.rows[0];
            if (order.status !== models_1.OrderStatus.PENDING_ADMIN) {
                throw new Error(`Order ${orderId} is not in pending_admin status`);
            }
            // 2. Check if insurance record already exists
            const insuranceResult = await (0, db_1.queryPhiDb)(`SELECT id FROM patient_insurance WHERE patient_id = $1 AND is_primary = $2`, [order.patient_id, insuranceData.isPrimary === false ? false : true]);
            let insuranceId;
            if (insuranceResult.rows.length > 0) {
                // Update existing insurance record
                insuranceId = insuranceResult.rows[0].id;
                const updateFields = [];
                const updateValues = [];
                let valueIndex = 1;
                // Map insuranceData fields to database columns
                const fieldMap = {
                    insurerName: 'insurer_name',
                    policyNumber: 'policy_number',
                    groupNumber: 'group_number',
                    planType: 'plan_type',
                    policyHolderName: 'policy_holder_name',
                    policyHolderRelationship: 'policy_holder_relationship',
                    policyHolderDateOfBirth: 'policy_holder_date_of_birth',
                    verificationStatus: 'verification_status'
                };
                // Build update query dynamically based on provided fields
                for (const [key, value] of Object.entries(insuranceData)) {
                    if (fieldMap[key] && value !== undefined) {
                        updateFields.push(`${fieldMap[key]} = $${valueIndex}`);
                        updateValues.push(value);
                        valueIndex++;
                    }
                }
                if (updateFields.length === 0) {
                    throw new Error('No valid insurance fields provided for update');
                }
                // Add updated_at field
                updateFields.push(`updated_at = NOW()`);
                const updateQuery = `
          UPDATE patient_insurance
          SET ${updateFields.join(', ')}
          WHERE id = $${valueIndex}
          RETURNING id
        `;
                const result = await (0, db_1.queryPhiDb)(updateQuery, [...updateValues, insuranceId]);
                insuranceId = result.rows[0].id;
            }
            else {
                // Create new insurance record
                if (!insuranceData.insurerName || !insuranceData.policyNumber) {
                    throw new Error('Insurer name and policy number are required for new insurance records');
                }
                const result = await (0, db_1.queryPhiDb)(`INSERT INTO patient_insurance
           (patient_id, is_primary, insurer_name, policy_number, group_number, 
            plan_type, policy_holder_name, policy_holder_relationship, 
            policy_holder_date_of_birth, verification_status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id`, [
                    order.patient_id,
                    insuranceData.isPrimary === false ? false : true,
                    insuranceData.insurerName,
                    insuranceData.policyNumber,
                    insuranceData.groupNumber || null,
                    insuranceData.planType || null,
                    insuranceData.policyHolderName || null,
                    insuranceData.policyHolderRelationship || null,
                    insuranceData.policyHolderDateOfBirth || null,
                    insuranceData.verificationStatus || 'not_verified'
                ]);
                insuranceId = result.rows[0].id;
            }
            return {
                success: true,
                orderId,
                insuranceId,
                message: 'Insurance information updated successfully'
            };
        }
        catch (error) {
            console.error('Error in updateInsuranceInfo:', error);
            throw error;
        }
    }
    /**
     * Send order to radiology
     * @param orderId Order ID
     * @param userId User ID
     * @returns Promise with result
     */
    async sendToRadiology(orderId, userId) {
        // Get a client for transaction
        const client = await (0, db_1.getPhiDbClient)();
        try {
            // Start transaction
            await client.query('BEGIN');
            // 1. Verify order exists and has status 'pending_admin'
            const orderResult = await client.query(`SELECT o.id, o.status, o.patient_id, o.referring_organization_id 
         FROM orders o
         WHERE o.id = $1`, [orderId]);
            if (orderResult.rows.length === 0) {
                throw new Error(`Order ${orderId} not found`);
            }
            const order = orderResult.rows[0];
            if (order.status !== models_1.OrderStatus.PENDING_ADMIN) {
                throw new Error(`Order ${orderId} is not in pending_admin status`);
            }
            // 2. Check if patient has required information
            const patientResult = await client.query(`SELECT p.id, p.first_name, p.last_name, p.date_of_birth, p.gender, 
                p.address_line1, p.city, p.state, p.zip_code, p.phone_number
         FROM patients p
         WHERE p.id = $1`, [order.patient_id]);
            if (patientResult.rows.length === 0) {
                throw new Error(`Patient not found for order ${orderId}`);
            }
            const patient = patientResult.rows[0];
            // Check for required patient fields
            const missingPatientFields = [];
            if (!patient.address_line1)
                missingPatientFields.push('address');
            if (!patient.city)
                missingPatientFields.push('city');
            if (!patient.state)
                missingPatientFields.push('state');
            if (!patient.zip_code)
                missingPatientFields.push('zip code');
            if (!patient.phone_number)
                missingPatientFields.push('phone number');
            // 3. Check if patient has insurance information
            const insuranceResult = await client.query(`SELECT i.id, i.insurer_name, i.policy_number
         FROM patient_insurance i
         WHERE i.patient_id = $1 AND i.is_primary = true`, [order.patient_id]);
            if (insuranceResult.rows.length === 0) {
                missingPatientFields.push('primary insurance');
            }
            else {
                const insurance = insuranceResult.rows[0];
                if (!insurance.insurer_name)
                    missingPatientFields.push('insurance provider name');
                if (!insurance.policy_number)
                    missingPatientFields.push('insurance policy number');
            }
            // If missing required fields, throw error
            if (missingPatientFields.length > 0) {
                throw new Error(`Cannot send to radiology: Missing required information: ${missingPatientFields.join(', ')}`);
            }
            // 4. Update order status to 'pending_radiology'
            await client.query(`UPDATE orders
         SET status = $1, updated_at = NOW(), updated_by_user_id = $2
         WHERE id = $3`, [models_1.OrderStatus.PENDING_RADIOLOGY, userId, orderId]);
            // 5. Log the event in order_history
            await client.query(`INSERT INTO order_history
         (order_id, user_id, event_type, previous_status, new_status, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`, [orderId, userId, 'sent_to_radiology', models_1.OrderStatus.PENDING_ADMIN, models_1.OrderStatus.PENDING_RADIOLOGY]);
            // Commit transaction
            await client.query('COMMIT');
            // TODO: Implement notification to Radiology group (future enhancement)
            return {
                success: true,
                orderId,
                message: 'Order sent to radiology successfully'
            };
        }
        catch (error) {
            // Rollback transaction on error
            await client.query('ROLLBACK');
            console.error('Error in sendToRadiology:', error);
            throw error;
        }
        finally {
            // Release client back to pool
            client.release();
        }
    }
    /**
     * Parse EMR summary text to extract patient and insurance information
     * @param text EMR summary text
     * @returns Parsed data
     */
    parseEmrSummary(text) {
        // This is a simple implementation that could be enhanced with more sophisticated NLP
        const parsedData = {
            patientInfo: {},
            insuranceInfo: {}
        };
        // Extract patient address
        const addressRegex = /(?:Address|Addr):\s*([^,\n]+)(?:,\s*([^,\n]+))?(?:,\s*([A-Z]{2}))?(?:,?\s*(\d{5}(?:-\d{4})?))?/i;
        const addressMatch = text.match(addressRegex);
        if (addressMatch) {
            parsedData.patientInfo.address = addressMatch[1]?.trim();
            parsedData.patientInfo.city = addressMatch[2]?.trim();
            parsedData.patientInfo.state = addressMatch[3]?.trim();
            parsedData.patientInfo.zipCode = addressMatch[4]?.trim();
        }
        // Extract patient phone
        const phoneRegex = /(?:Phone|Tel|Telephone):\s*(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i;
        const phoneMatch = text.match(phoneRegex);
        if (phoneMatch) {
            parsedData.patientInfo.phone = phoneMatch[1]?.trim();
        }
        // Extract patient email
        const emailRegex = /(?:Email|E-mail):\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
        const emailMatch = text.match(emailRegex);
        if (emailMatch) {
            parsedData.patientInfo.email = emailMatch[1]?.trim();
        }
        // Extract insurance information
        const insuranceRegex = /(?:Insurance|Ins)(?:urance)?(?:\s*Provider)?:\s*([^\n,]+)(?:,|\n|$)/i;
        const insuranceMatch = text.match(insuranceRegex);
        if (insuranceMatch) {
            parsedData.insuranceInfo.insurerName = insuranceMatch[1]?.trim();
        }
        // Extract policy number
        const policyRegex = /(?:Policy|Member|ID)(?:\s*(?:Number|#|No))?\s*:\s*([A-Za-z0-9-]+)/i;
        const policyMatch = text.match(policyRegex);
        if (policyMatch) {
            parsedData.insuranceInfo.policyNumber = policyMatch[1]?.trim();
        }
        // Extract group number
        const groupRegex = /(?:Group|Grp)(?:\s*(?:Number|#|No))?\s*:\s*([A-Za-z0-9-]+)/i;
        const groupMatch = text.match(groupRegex);
        if (groupMatch) {
            parsedData.insuranceInfo.groupNumber = groupMatch[1]?.trim();
        }
        // Extract policy holder name
        const holderRegex = /(?:Policy\s*Holder|Subscriber|Insured)(?:\s*Name)?\s*:\s*([^\n,]+)(?:,|\n|$)/i;
        const holderMatch = text.match(holderRegex);
        if (holderMatch) {
            parsedData.insuranceInfo.policyHolderName = holderMatch[1]?.trim();
        }
        return parsedData;
    }
}
exports.default = new AdminOrderService();
//# sourceMappingURL=admin-order.service.js.map