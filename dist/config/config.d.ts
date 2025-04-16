declare const _default: {
    port: string | number;
    frontendUrl: string;
    nodeEnv: string;
    mainDatabaseUrl: string | undefined;
    phiDatabaseUrl: string | undefined;
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptSaltRounds: number;
    registrationKey: string;
    aws: {
        accessKeyId: string | undefined;
        secretAccessKey: string | undefined;
        region: string;
        s3: {
            bucketName: string | undefined;
        };
        ses: {
            fromEmail: string;
            testMode: boolean;
        };
    };
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
        apiVersion: string;
        creditBundlePriceId: string | undefined;
        frontendSuccessUrl: string;
        frontendCancelUrl: string;
    };
    testMode: {
        email: boolean;
        billing: boolean;
    };
    llm: {
        anthropicApiKey: string | undefined;
        grokApiKey: string | undefined;
        openaiApiKey: string | undefined;
        claudeModelName: string;
        grokModelName: string;
        gptModelName: string;
        maxTokens: number;
        timeout: number;
    };
};
export default _default;
