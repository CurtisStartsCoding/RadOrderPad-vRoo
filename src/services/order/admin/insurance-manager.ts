/**
 * This file is a compatibility layer for the refactored insurance module.
 * It re-exports the functions from the insurance directory to maintain
 * backward compatibility with existing code.
 */

import { updateInsuranceInfo, updateInsuranceFromEmr } from './insurance';

export {
  updateInsuranceInfo,
  updateInsuranceFromEmr
};