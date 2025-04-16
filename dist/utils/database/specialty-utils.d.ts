/**
 * Get user's specialty from the database
 * @param userId The ID of the user
 * @returns The user's specialty or 'General Radiology' if not found
 */
export declare function getUserSpecialty(userId: number): Promise<string>;
/**
 * Get optimal word count for a specialty from the database
 * @param specialty The specialty name
 * @returns The optimal word count for the specialty or 33 if not found
 */
export declare function getOptimalWordCount(specialty: string): Promise<number>;
