import { Pool } from 'pg';
export declare const mainDbConfig: {
    connectionString: string | undefined;
    ssl: boolean | {
        rejectUnauthorized: boolean;
    };
};
export declare const phiDbConfig: {
    connectionString: string | undefined;
    ssl: boolean | {
        rejectUnauthorized: boolean;
    };
};
export declare const mainDbPool: Pool;
export declare const phiDbPool: Pool;
