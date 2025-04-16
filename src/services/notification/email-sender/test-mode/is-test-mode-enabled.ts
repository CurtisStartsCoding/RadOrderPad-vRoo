import config from '../../../../config/config';

/**
 * Check if email test mode is enabled
 */
export function isTestModeEnabled(): boolean {
  return config.aws.ses.testMode;
}