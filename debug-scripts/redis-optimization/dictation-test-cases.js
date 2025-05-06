/**
 * Dictation test cases for Redis optimization testing
 */

const testCases = [
  {
    id: 1,
    dictation: "42-year-old female presents with right upper quadrant pain. Patient has elevated liver enzymes and a history of gallstones. Requesting abdominal ultrasound to evaluate liver and gallbladder.",
    expectedPrimaryCode: "R10.11", // Right upper quadrant pain
    expectedSecondaryCodes: ["R74.8", "K80.20", "K76.9", "R16.0"],
    expectedCptCode: "76700" // Ultrasound, abdominal, complete
  },
  {
    id: 2,
    dictation: "68-year-old male with progressive memory loss, confusion, and headaches. Family history of dementia. Requesting MRI brain with and without contrast to evaluate for neurodegenerative disease.",
    expectedPrimaryCode: "R41.2", // Retrograde amnesia
    expectedSecondaryCodes: ["R41.0", "R51.9", "Z82.0", "G31.84"],
    expectedCptCode: "70553" // MRI brain with and without contrast
  },
  {
    id: 3,
    dictation: "56-year-old female with palpable right breast lump and nipple discharge. Family history of breast cancer. Requesting diagnostic mammogram to evaluate for malignancy.",
    expectedPrimaryCode: "N63", // Unspecified lump in breast
    expectedSecondaryCodes: ["R92.8", "N64.52", "Z80.3", "Z12.31"],
    expectedCptCode: "77065" // Diagnostic mammography, unilateral
  },
  {
    id: 4,
    dictation: "72-year-old male with persistent cough and shortness of breath. Former smoker with abnormal chest X-ray showing nodule. Requesting CT chest with contrast for further evaluation.",
    expectedPrimaryCode: "R91.1", // Solitary pulmonary nodule
    expectedSecondaryCodes: ["R05", "R06.02", "Z87.891", "J98.9"],
    expectedCptCode: "71260" // CT thorax with contrast
  },
  {
    id: 5,
    dictation: "35-year-old female with lower back pain radiating to left leg and numbness in left foot. Suspected herniated disc. Requesting MRI lumbar spine without contrast.",
    expectedPrimaryCode: "M54.5", // Low back pain
    expectedSecondaryCodes: ["M54.16", "R20.2", "M51.26", "G83.14"],
    expectedCptCode: "72148" // MRI lumbar spine without contrast
  },
  {
    id: 6,
    dictation: "28-year-old male who fell on outstretched hand. Presents with right wrist pain and swelling. Requesting X-ray of right wrist to rule out fracture.",
    expectedPrimaryCode: "S62.10XA", // Fracture of navicular [scaphoid] bone of wrist, initial encounter
    expectedSecondaryCodes: ["W01.198A"],
    expectedCptCode: "73100" // X-ray wrist, 2 views
  },
  {
    id: 7,
    dictation: "62-year-old postmenopausal female with family history of osteoporosis. Requesting bone density scan (DEXA) for osteoporosis screening.",
    expectedPrimaryCode: "Z13.820", // Encounter for screening for osteoporosis
    expectedSecondaryCodes: ["Z80.8"],
    expectedCptCode: "77080" // DEXA bone density study
  }
];

module.exports = testCases;