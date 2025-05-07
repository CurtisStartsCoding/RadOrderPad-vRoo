/**
 * Utility functions for text processing
 */

/**
 * Strip PHI (Personal Health Information) from text
 * This is a basic implementation that removes obvious identifiers
 * In a production environment, this would be more sophisticated
 */
export function stripPHI(text: string): string {
  // Replace common PHI patterns
  let sanitizedText = text;
  
  // Replace potential MRN numbers (Medical Record Numbers)
  sanitizedText = sanitizedText.replace(/\b[A-Z]{0,3}\d{5,10}\b/g, '[MRN]');
  
  // Replace potential SSNs
  sanitizedText = sanitizedText.replace(/\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, '[SSN]');
  
  // Replace potential phone numbers (various formats)
  sanitizedText = sanitizedText.replace(/\b\d{3}[-\.\s]?\d{3}[-\.\s]?\d{4}\b/g, '[PHONE]');
  sanitizedText = sanitizedText.replace(/\(\d{3}\)\s*\d{3}[-\.\s]?\d{4}\b/g, '[PHONE]');
  sanitizedText = sanitizedText.replace(/\b1[-\.\s]?\d{3}[-\.\s]?\d{3}[-\.\s]?\d{4}\b/g, '[PHONE]');
  
  // Replace potential dates (various formats, but preserve age references)
  sanitizedText = sanitizedText.replace(/\b(0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])[\/\-\.](19|20)\d{2}\b/g, '[DATE]');
  sanitizedText = sanitizedText.replace(/\b(19|20)\d{2}[\/\-\.](0?[1-9]|1[0-2])[\/\-\.](0?[1-9]|[12]\d|3[01])\b/g, '[DATE]');
  sanitizedText = sanitizedText.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (0?[1-9]|[12]\d|3[01])(st|nd|rd|th)?,? (19|20)\d{2}\b/gi, '[DATE]');
  
  // Replace potential full names (improved patterns)
  // This looks for patterns like "John Smith", "Smith, John", "John A. Smith", etc.
  sanitizedText = sanitizedText.replace(/\b[A-Z][a-z]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][a-z]+)+\b/g, '[NAME]');
  sanitizedText = sanitizedText.replace(/\b[A-Z][a-z]+,\s+[A-Z][a-z]+(?:\s+[A-Z]\.?)?\b/g, '[NAME]');
  
  // Replace email addresses
  sanitizedText = sanitizedText.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[EMAIL]');
  
  // Replace URLs that might contain identifying information
  sanitizedText = sanitizedText.replace(/https?:\/\/[^\s]+/g, '[URL]');
  
  // Replace potential addresses
  sanitizedText = sanitizedText.replace(/\b\d+\s+[A-Za-z\s]+(?:Avenue|Ave|Street|St|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl|Terrace|Ter)\b/gi, '[ADDRESS]');
  
  // Replace potential zip codes
  sanitizedText = sanitizedText.replace(/\b\d{5}(?:-\d{4})?\b/g, '[ZIP]');
  
  return sanitizedText;
}

/**
 * Extract medical keywords from text
 * This is a basic implementation that extracts potential medical terms
 */
export function extractMedicalKeywords(text: string): string[] {
  const keywords: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Common anatomical terms - expanded
  const anatomyTerms = [
    // Head and neck
    'head', 'neck', 'skull', 'brain', 'cerebral', 'cranial', 'facial', 'sinus', 'nasal', 'orbit',
    'eye', 'ocular', 'ear', 'temporal', 'jaw', 'mandible', 'maxilla', 'throat', 'pharynx', 'larynx',
    'thyroid', 'cervical',
    
    // Upper extremities
    'shoulder', 'arm', 'elbow', 'forearm', 'wrist', 'hand', 'finger', 'thumb', 'humerus', 'radius',
    'ulna', 'carpal', 'metacarpal', 'phalanges',
    
    // Torso
    'chest', 'thorax', 'thoracic', 'rib', 'sternum', 'clavicle', 'scapula', 'abdomen', 'abdominal',
    'pelvis', 'pelvic', 'hip', 'spine', 'vertebra', 'vertebral', 'lumbar', 'sacral', 'coccyx',
    
    // Lower extremities
    'leg', 'thigh', 'knee', 'patella', 'tibia', 'fibula', 'ankle', 'foot', 'toe', 'heel', 'femur',
    'tarsal', 'metatarsal',
    
    // Internal organs
    'liver', 'hepatic', 'kidney', 'renal', 'spleen', 'splenic', 'pancreas', 'pancreatic',
    'gallbladder', 'biliary', 'bladder', 'urinary', 'uterus', 'uterine', 'ovary', 'ovarian',
    'prostate', 'prostatic', 'testis', 'testicular', 'lung', 'pulmonary', 'heart', 'cardiac',
    'aorta', 'aortic', 'artery', 'arterial', 'vein', 'venous', 'intestine', 'intestinal',
    'colon', 'colonic', 'rectum', 'rectal', 'stomach', 'gastric', 'esophagus', 'esophageal'
  ];
  
  // Common modalities - expanded
  const modalities = [
    // X-ray related
    'x-ray', 'xray', 'radiograph', 'radiography', 'plain film',
    
    // CT related
    'ct', 'cat scan', 'computed tomography', 'ct scan', 'ct angiogram', 'cta',
    
    // MRI related
    'mri', 'magnetic resonance', 'mr', 'fmri', 'mr angiogram', 'mra', 'mrcp',
    
    // Ultrasound related
    'ultrasound', 'sonogram', 'sonography', 'doppler', 'echocardiogram', 'echo',
    
    // Nuclear medicine
    'pet', 'pet scan', 'pet-ct', 'nuclear', 'nuclear medicine', 'spect', 'bone scan',
    
    // Angiography
    'angiogram', 'angiography', 'venogram', 'venography', 'arteriogram',
    
    // Other imaging
    'mammogram', 'mammography', 'dexa', 'bone density', 'fluoroscopy', 'myelogram',
    'discogram', 'arthrogram'
  ];
  
  // Common symptoms and conditions - expanded
  const symptoms = [
    // Pain and discomfort
    'pain', 'ache', 'discomfort', 'tenderness', 'burning', 'sharp', 'dull', 'chronic', 'acute',
    
    // Inflammation and swelling
    'swelling', 'inflammation', 'edema', 'effusion', 'enlarged', 'hypertrophy',
    
    // Trauma
    'fracture', 'break', 'sprain', 'strain', 'tear', 'rupture', 'dislocation', 'subluxation',
    'trauma', 'injury', 'wound', 'laceration',
    
    // Growths and masses
    'mass', 'tumor', 'cancer', 'malignancy', 'neoplasm', 'lesion', 'nodule', 'cyst', 'polyp',
    
    // Infections and inflammation
    'infection', 'abscess', 'cellulitis', 'osteomyelitis', 'septic',
    
    // Vascular issues
    'bleeding', 'hemorrhage', 'clot', 'thrombus', 'embolism', 'ischemia', 'infarct',
    'stenosis', 'blockage', 'obstruction', 'occlusion', 'aneurysm', 'dissection',
    
    // Stones and calcifications
    'stone', 'calculus', 'calcification', 'lithiasis',
    
    // Degenerative conditions
    'arthritis', 'osteoarthritis', 'degeneration', 'degenerative', 'herniation', 'herniated',
    'bulging', 'protrusion', 'spondylosis', 'spondylolisthesis', 'stenosis',
    
    // Other common conditions
    'pneumonia', 'bronchitis', 'copd', 'asthma', 'fibrosis', 'emphysema',
    'stroke', 'tia', 'seizure', 'epilepsy', 'dementia', 'alzheimer',
    'diabetes', 'hypertension', 'hyperlipidemia', 'atherosclerosis',
    'gastritis', 'gerd', 'ulcer', 'colitis', 'diverticulitis', 'appendicitis',
    'nephritis', 'pyelonephritis', 'renal failure', 'urolithiasis',
    'hepatitis', 'cirrhosis', 'cholecystitis', 'pancreatitis'
  ];
  
  // Check for anatomy terms using more sophisticated matching
  anatomyTerms.forEach(term => {
    // Look for whole words, not partial matches
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerText)) {
      keywords.push(term);
    }
  });
  
  // Check for modalities using more sophisticated matching
  modalities.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerText)) {
      keywords.push(term);
    }
  });
  
  // Check for symptoms using more sophisticated matching
  symptoms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerText)) {
      keywords.push(term);
    }
  });
  
  // Extract potential ICD-10 codes (improved regex)
  const icd10Regex = /\b[A-Z]\d{2}(?:\.\d{1,2})?\b/g;
  const icd10Matches = text.match(icd10Regex);
  if (icd10Matches) {
    keywords.push(...icd10Matches);
  }
  
  // Extract potential CPT codes (improved regex)
  const cptRegex = /\b\d{5}\b/g;
  const cptMatches = text.match(cptRegex);
  if (cptMatches) {
    // Filter out potential zip codes or other 5-digit numbers
    // that are not likely to be CPT codes
    const filteredCptMatches = cptMatches.filter(code => {
      // Most CPT codes for radiology start with 7
      // This is a simple heuristic that could be improved
      return code.startsWith('7') || code.startsWith('9');
    });
    keywords.push(...filteredCptMatches);
  }
  
  // Extract common medical abbreviations
  const medicalAbbreviations = [
    'ca', 'dx', 'fx', 'hx', 'px', 'rx', 'sx', 'tx',
    'ap', 'pa', 'lat', 'bilat', 'w/', 'w/o', 's/p',
    'r/o', 'c/o', 'h/o', 'p/o'
  ];
  
  medicalAbbreviations.forEach(abbr => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'i');
    if (regex.test(lowerText)) {
      keywords.push(abbr);
    }
  });
  
  // Remove duplicates and convert to lowercase for consistency
  const uniqueKeywords = [...new Set(keywords.map(k => k.toLowerCase()))];
  
  return uniqueKeywords;
}