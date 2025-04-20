import bcrypt from 'bcrypt';
/**
 * Create an admin user for an organization
 */
export async function createAdminUser(client, userData, organizationId) {
    // Hash the password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);
    // Create the admin user
    const userResult = await client.query(`INSERT INTO users
    (organization_id, email, password_hash, first_name, last_name, role, npi,
    specialty, phone_number, is_active, email_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *`, [
        organizationId,
        userData.email,
        passwordHash,
        userData.first_name,
        userData.last_name,
        userData.role,
        userData.npi || null,
        userData.specialty || null,
        userData.phone_number || null,
        true, // is_active
        false // email_verified
    ]);
    return userResult.rows[0];
}
//# sourceMappingURL=create-admin-user.js.map