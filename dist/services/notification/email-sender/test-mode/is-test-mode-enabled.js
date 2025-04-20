import config from '../../../../config/config';
/**
 * Check if email test mode is enabled
 */
export function isTestModeEnabled() {
    return config.aws.ses.testMode;
}
//# sourceMappingURL=is-test-mode-enabled.js.map