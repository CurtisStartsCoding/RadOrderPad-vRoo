
9:19:30 PM [express] GET /api/auth/session 200 in 4ms :: {"authenticated":false}
[Redis] Checking availability...
[Redis] Availability check response: PONG
[Redis] Checking availability...
[Redis] Availability check response: PONG
Redis caching enabled
🔍 Checking Redis cache for database context...
[Redis] Cache MISS for context code: pgcontext:IjQ4LXllYXItb2xkIGZl
❌ REDIS CACHE MISS - Generating fresh database context
POSTGRES - Generating fresh database context from PostgreSQL
POSTGRES - Generating database context from PostgreSQL
POSTGRES - Extracted keywords: [
  'ultrasound',    'abdomen',   'right',
  'pain',          'chronic',   'diarrhea',
  'past',          'months',    'typically',
  'loose',         'stools',    'daily',
  'reports',       'upper',     'quadrant',
  'discomfort',    'after',     'meals',
  'noted',         'darkening', 'skin',
  'knuckles',      'neck',      'folds',
  'recent',        'work',      'shows',
  'mildly',        'elevated',  'ferritin',
  'transaminases', 'family',    'history',
  'significant',   'father',    'cirrhosis',
  'unknown',       'cause',     'order',
  'abdominal',     'evaluate',  'possible',
  'gallbladder',   'disease'
]
POSTGRES - Searching for diagnosis codes with keywords: [
  'ultrasound',    'abdomen',   'right',
  'pain',          'chronic',   'diarrhea',
  'past',          'months',    'typically',
  'loose',         'stools',    'daily',
  'reports',       'upper',     'quadrant',
  'discomfort',    'after',     'meals',
  'noted',         'darkening', 'skin',
  'knuckles',      'neck',      'folds',
  'recent',        'work',      'shows',
  'mildly',        'elevated',  'ferritin',
  'transaminases', 'family',    'history',
  'significant',   'father',    'cirrhosis',
  'unknown',       'cause',     'order',
  'abdominal',     'evaluate',  'possible',
  'gallbladder',   'disease'
]
Redis caching enabled
👉 Redis caching EXPLICITLY ENABLED for diagnosis lookup
🔍 Searching ICD10 with combined keywords: "ultrasound abdomen right"
[Redis] Cache MISS for icd10 code: search:ultrasound abdomen right
🔍 PostgreSQL lookup for ICD10 with keyword: "ultrasound abdomen right"
🔍 Searching ICD10 with combined keywords: "pain chronic diarrhea"
[Redis] Cache MISS for icd10 code: search:pain chronic diarrhea
🔍 PostgreSQL lookup for ICD10 with keyword: "pain chronic diarrhea"
🔍 Searching ICD10 with combined keywords: "past months typically"
[Redis] Cache MISS for icd10 code: search:past months typically
🔍 PostgreSQL lookup for ICD10 with keyword: "past months typically"
🔍 Searching ICD10 with combined keywords: "loose stools daily"
[Redis] Cache MISS for icd10 code: search:loose stools daily
🔍 PostgreSQL lookup for ICD10 with keyword: "loose stools daily"
🔍 Searching ICD10 with combined keywords: "reports upper quadrant"
[Redis] Cache MISS for icd10 code: search:reports upper quadrant
🔍 PostgreSQL lookup for ICD10 with keyword: "reports upper quadrant"
🔍 Searching ICD10 with combined keywords: "discomfort after meals"
[Redis] Cache MISS for icd10 code: search:discomfort after meals
🔍 PostgreSQL lookup for ICD10 with keyword: "discomfort after meals"
🔍 Searching ICD10 with combined keywords: "noted darkening skin"
[Redis] Cache MISS for icd10 code: search:noted darkening skin
🔍 PostgreSQL lookup for ICD10 with keyword: "noted darkening skin"
🔍 Searching ICD10 with combined keywords: "knuckles neck folds"
[Redis] Cache MISS for icd10 code: search:knuckles neck folds
🔍 PostgreSQL lookup for ICD10 with keyword: "knuckles neck folds"
🔍 Searching ICD10 with combined keywords: "recent work shows"
[Redis] Cache MISS for icd10 code: search:recent work shows
🔍 PostgreSQL lookup for ICD10 with keyword: "recent work shows"
🔍 Searching ICD10 with combined keywords: "mildly elevated ferritin"
[Redis] Cache MISS for icd10 code: search:mildly elevated ferritin
🔍 PostgreSQL lookup for ICD10 with keyword: "mildly elevated ferritin"
🔍 Searching ICD10 with combined keywords: "transaminases family history"
[Redis] Cache MISS for icd10 code: search:transaminases family history
🔍 PostgreSQL lookup for ICD10 with keyword: "transaminases family history"
🔍 Searching ICD10 with combined keywords: "significant father cirrhosis"
[Redis] Cache MISS for icd10 code: search:significant father cirrhosis
🔍 PostgreSQL lookup for ICD10 with keyword: "significant father cirrhosis"
🔍 Searching ICD10 with combined keywords: "unknown cause order"
[Redis] Cache MISS for icd10 code: search:unknown cause order
🔍 PostgreSQL lookup for ICD10 with keyword: "unknown cause order"
🔍 Searching ICD10 with combined keywords: "abdominal evaluate possible"
[Redis] Cache MISS for icd10 code: search:abdominal evaluate possible
🔍 PostgreSQL lookup for ICD10 with keyword: "abdominal evaluate possible"
🔍 Searching ICD10 with combined keywords: "gallbladder disease"
[Redis] Cache MISS for icd10 code: search:gallbladder disease
🔍 PostgreSQL lookup for ICD10 with keyword: "gallbladder disease"
🔍 Searching ICD10 with individual keyword: "ultrasound"
[Redis] Cache MISS for icd10 code: search:ultrasound
🔍 PostgreSQL lookup for ICD10 with keyword: "ultrasound"
🔍 Searching ICD10 with individual keyword: "abdomen"
[Redis] Cache HIT for icd10 code: search:abdomen
✅ Found 68 results for "abdomen"
✅ Found 68 results for "abdomen"
🔍 Searching ICD10 with individual keyword: "right"
[Redis] Cache HIT for icd10 code: search:right
✅ Found 100 results for "right"
✅ Found 100 results for "right"
🔍 Searching ICD10 with individual keyword: "pain"
[Redis] Cache HIT for icd10 code: search:pain
✅ Found 100 results for "pain"
✅ Found 100 results for "pain"
🔍 Searching ICD10 with individual keyword: "chronic"
[Redis] Cache HIT for icd10 code: search:chronic
✅ Found 100 results for "chronic"
✅ Found 100 results for "chronic"
🔍 Searching ICD10 with individual keyword: "diarrhea"
[Redis] Cache HIT for icd10 code: search:diarrhea
✅ Found 12 results for "diarrhea"
✅ Found 12 results for "diarrhea"
🔍 Searching ICD10 with individual keyword: "past"
[Redis] Cache HIT for icd10 code: search:past
✅ Found 30 results for "past"
✅ Found 30 results for "past"
🔍 Searching ICD10 with individual keyword: "months"
[Redis] Cache HIT for icd10 code: search:months
✅ Found 1 results for "months"
✅ Found 1 results for "months"
🔍 Searching ICD10 with individual keyword: "typically"
[Redis] Cache MISS for icd10 code: search:typically
🔍 PostgreSQL lookup for ICD10 with keyword: "typically"
🔍 Searching ICD10 with individual keyword: "loose"
[Redis] Cache HIT for icd10 code: search:loose
✅ Found 41 results for "loose"
✅ Found 41 results for "loose"
🔍 Searching ICD10 with individual keyword: "stools"
[Redis] Cache MISS for icd10 code: search:stools
🔍 PostgreSQL lookup for ICD10 with keyword: "stools"
🔍 Searching ICD10 with individual keyword: "daily"
[Redis] Cache HIT for icd10 code: search:daily
✅ Found 2 results for "daily"
✅ Found 2 results for "daily"
🔍 Searching ICD10 with individual keyword: "reports"
[Redis] Cache MISS for icd10 code: search:reports
🔍 PostgreSQL lookup for ICD10 with keyword: "reports"
🔍 Searching ICD10 with individual keyword: "upper"
[Redis] Cache MISS for icd10 code: search:upper
🔍 PostgreSQL lookup for ICD10 with keyword: "upper"
[Redis] Cached icd10 code: search:upper
[Redis] Cached 100 results for "upper"
✅ Found 100 results for "upper"
🔍 Searching ICD10 with individual keyword: "quadrant"
[Redis] Cache HIT for icd10 code: search:quadrant
✅ Found 100 results for "quadrant"
✅ Found 100 results for "quadrant"
🔍 Searching ICD10 with individual keyword: "discomfort"
[Redis] Cache HIT for icd10 code: search:discomfort
✅ Found 5 results for "discomfort"
✅ Found 5 results for "discomfort"
🔍 Searching ICD10 with individual keyword: "after"
[Redis] Cache HIT for icd10 code: search:after
✅ Found 100 results for "after"
✅ Found 100 results for "after"
🔍 Searching ICD10 with individual keyword: "meals"
[Redis] Cache MISS for icd10 code: search:meals
🔍 PostgreSQL lookup for ICD10 with keyword: "meals"
🔍 Searching ICD10 with individual keyword: "noted"
[Redis] Cache HIT for icd10 code: search:noted
✅ Found 3 results for "noted"
✅ Found 3 results for "noted"
🔍 Searching ICD10 with individual keyword: "darkening"
[Redis] Cache MISS for icd10 code: search:darkening
🔍 PostgreSQL lookup for ICD10 with keyword: "darkening"
🔍 Searching ICD10 with individual keyword: "skin"
[Redis] Cache HIT for icd10 code: search:skin
✅ Found 100 results for "skin"
✅ Found 100 results for "skin"
🔍 Searching ICD10 with individual keyword: "knuckles"
[Redis] Cache MISS for icd10 code: search:knuckles
🔍 PostgreSQL lookup for ICD10 with keyword: "knuckles"
🔍 Searching ICD10 with individual keyword: "neck"
[Redis] Cache MISS for icd10 code: search:neck
🔍 PostgreSQL lookup for ICD10 with keyword: "neck"
[Redis] Cached icd10 code: search:neck
[Redis] Cached 100 results for "neck"
✅ Found 100 results for "neck"
🔍 Searching ICD10 with individual keyword: "folds"
[Redis] Cache HIT for icd10 code: search:folds
✅ Found 10 results for "folds"
✅ Found 10 results for "folds"
🔍 Searching ICD10 with individual keyword: "recent"
[Redis] Cache HIT for icd10 code: search:recent
✅ Found 10 results for "recent"
✅ Found 10 results for "recent"
🔍 Searching ICD10 with individual keyword: "work"
[Redis] Cache HIT for icd10 code: search:work
✅ Found 14 results for "work"
✅ Found 14 results for "work"
🔍 Searching ICD10 with individual keyword: "shows"
[Redis] Cache MISS for icd10 code: search:shows
🔍 PostgreSQL lookup for ICD10 with keyword: "shows"
🔍 Searching ICD10 with individual keyword: "mildly"
[Redis] Cache MISS for icd10 code: search:mildly
🔍 PostgreSQL lookup for ICD10 with keyword: "mildly"
🔍 Searching ICD10 with individual keyword: "elevated"
[Redis] Cache HIT for icd10 code: search:elevated
✅ Found 15 results for "elevated"
✅ Found 15 results for "elevated"
🔍 Searching ICD10 with individual keyword: "ferritin"
[Redis] Cache MISS for icd10 code: search:ferritin
🔍 PostgreSQL lookup for ICD10 with keyword: "ferritin"
🔍 Searching ICD10 with individual keyword: "transaminases"
[Redis] Cache MISS for icd10 code: search:transaminases
🔍 PostgreSQL lookup for ICD10 with keyword: "transaminases"
🔍 Searching ICD10 with individual keyword: "family"
[Redis] Cache HIT for icd10 code: search:family
✅ Found 100 results for "family"
✅ Found 100 results for "family"
🔍 Searching ICD10 with individual keyword: "history"
[Redis] Cache MISS for icd10 code: search:history
🔍 PostgreSQL lookup for ICD10 with keyword: "history"
[Redis] Cached icd10 code: search:history
[Redis] Cached 100 results for "history"
✅ Found 100 results for "history"
🔍 Searching ICD10 with individual keyword: "significant"
[Redis] Cache MISS for icd10 code: search:significant
🔍 PostgreSQL lookup for ICD10 with keyword: "significant"
[Redis] Cached icd10 code: search:significant
[Redis] Cached 7 results for "significant"
✅ Found 7 results for "significant"
🔍 Searching ICD10 with individual keyword: "father"
[Redis] Cache HIT for icd10 code: search:father
✅ Found 4 results for "father"
✅ Found 4 results for "father"
🔍 Searching ICD10 with individual keyword: "cirrhosis"
[Redis] Cache HIT for icd10 code: search:cirrhosis
✅ Found 12 results for "cirrhosis"
✅ Found 12 results for "cirrhosis"
🔍 Searching ICD10 with individual keyword: "unknown"
[Redis] Cache HIT for icd10 code: search:unknown
✅ Found 28 results for "unknown"
✅ Found 28 results for "unknown"
🔍 Searching ICD10 with individual keyword: "cause"
[Redis] Cache HIT for icd10 code: search:cause
✅ Found 100 results for "cause"
✅ Found 100 results for "cause"
🔍 Searching ICD10 with individual keyword: "order"
[Redis] Cache HIT for icd10 code: search:order
✅ Found 100 results for "order"
✅ Found 100 results for "order"
🔍 Searching ICD10 with individual keyword: "abdominal"
[Redis] Cache HIT for icd10 code: search:abdominal
✅ Found 100 results for "abdominal"
✅ Found 100 results for "abdominal"
🔍 Searching ICD10 with individual keyword: "evaluate"
[Redis] Cache MISS for icd10 code: search:evaluate
🔍 PostgreSQL lookup for ICD10 with keyword: "evaluate"
🔍 Searching ICD10 with individual keyword: "possible"
[Redis] Cache MISS for icd10 code: search:possible
🔍 PostgreSQL lookup for ICD10 with keyword: "possible"
🔍 Searching ICD10 with individual keyword: "gallbladder"
[Redis] Cache HIT for icd10 code: search:gallbladder
✅ Found 49 results for "gallbladder"
✅ Found 49 results for "gallbladder"
🔍 Searching ICD10 with individual keyword: "disease"
[Redis] Cache HIT for icd10 code: search:disease
✅ Found 100 results for "disease"
✅ Found 100 results for "disease"
POSTGRES - Found 1555 diagnosis codes
POSTGRES - Searching for procedure codes with keywords: [
  'ultrasound',    'abdomen',   'right',
  'pain',          'chronic',   'diarrhea',
  'past',          'months',    'typically',
  'loose',         'stools',    'daily',
  'reports',       'upper',     'quadrant',
  'discomfort',    'after',     'meals',
  'noted',         'darkening', 'skin',
  'knuckles',      'neck',      'folds',
  'recent',        'work',      'shows',
  'mildly',        'elevated',  'ferritin',
  'transaminases', 'family',    'history',
  'significant',   'father',    'cirrhosis',
  'unknown',       'cause',     'order',
  'abdominal',     'evaluate',  'possible',
  'gallbladder',   'disease'
]
Redis caching enabled
👉 Redis caching EXPLICITLY ENABLED for procedure lookup
🔍 Searching CPT with combined keywords: "ultrasound abdomen right"
[Redis] Cache MISS for cpt code: search:ultrasound abdomen right
🔍 PostgreSQL lookup for CPT with keyword: "ultrasound abdomen right"
🔍 Searching CPT with combined keywords: "pain chronic diarrhea"
[Redis] Cache MISS for cpt code: search:pain chronic diarrhea
🔍 PostgreSQL lookup for CPT with keyword: "pain chronic diarrhea"
🔍 Searching CPT with combined keywords: "past months typically"
[Redis] Cache MISS for cpt code: search:past months typically
🔍 PostgreSQL lookup for CPT with keyword: "past months typically"
🔍 Searching CPT with combined keywords: "loose stools daily"
[Redis] Cache MISS for cpt code: search:loose stools daily
🔍 PostgreSQL lookup for CPT with keyword: "loose stools daily"
🔍 Searching CPT with combined keywords: "reports upper quadrant"
[Redis] Cache MISS for cpt code: search:reports upper quadrant
🔍 PostgreSQL lookup for CPT with keyword: "reports upper quadrant"
🔍 Searching CPT with combined keywords: "discomfort after meals"
[Redis] Cache MISS for cpt code: search:discomfort after meals
🔍 PostgreSQL lookup for CPT with keyword: "discomfort after meals"
🔍 Searching CPT with combined keywords: "noted darkening skin"
[Redis] Cache MISS for cpt code: search:noted darkening skin
🔍 PostgreSQL lookup for CPT with keyword: "noted darkening skin"
🔍 Searching CPT with combined keywords: "knuckles neck folds"
[Redis] Cache MISS for cpt code: search:knuckles neck folds
🔍 PostgreSQL lookup for CPT with keyword: "knuckles neck folds"
🔍 Searching CPT with combined keywords: "recent work shows"
[Redis] Cache MISS for cpt code: search:recent work shows
🔍 PostgreSQL lookup for CPT with keyword: "recent work shows"
🔍 Searching CPT with combined keywords: "mildly elevated ferritin"
[Redis] Cache MISS for cpt code: search:mildly elevated ferritin
🔍 PostgreSQL lookup for CPT with keyword: "mildly elevated ferritin"
🔍 Searching CPT with combined keywords: "transaminases family history"
[Redis] Cache MISS for cpt code: search:transaminases family history
🔍 PostgreSQL lookup for CPT with keyword: "transaminases family history"
🔍 Searching CPT with combined keywords: "significant father cirrhosis"
[Redis] Cache MISS for cpt code: search:significant father cirrhosis
🔍 PostgreSQL lookup for CPT with keyword: "significant father cirrhosis"
🔍 Searching CPT with combined keywords: "unknown cause order"
[Redis] Cache MISS for cpt code: search:unknown cause order
🔍 PostgreSQL lookup for CPT with keyword: "unknown cause order"
🔍 Searching CPT with combined keywords: "abdominal evaluate possible"
[Redis] Cache MISS for cpt code: search:abdominal evaluate possible
🔍 PostgreSQL lookup for CPT with keyword: "abdominal evaluate possible"
🔍 Searching CPT with combined keywords: "gallbladder disease ultrasound"
[Redis] Cache MISS for cpt code: search:gallbladder disease ultrasound
🔍 PostgreSQL lookup for CPT with keyword: "gallbladder disease ultrasound"
🔍 Searching CPT with individual keyword: "ultrasound"
[Redis] Cache HIT for cpt code: search:ultrasound
✅ Found 28 CPT results for "ultrasound"
✅ Found 28 CPT results for "ultrasound"
🔍 Searching CPT with individual keyword: "abdomen"
[Redis] Cache HIT for cpt code: search:abdomen
✅ Found 14 CPT results for "abdomen"
✅ Found 14 CPT results for "abdomen"
🔍 Searching CPT with individual keyword: "right"
[Redis] Cache MISS for cpt code: search:right
🔍 PostgreSQL lookup for CPT with keyword: "right"
🔍 Searching CPT with individual keyword: "pain"
[Redis] Cache MISS for cpt code: search:pain
🔍 PostgreSQL lookup for CPT with keyword: "pain"
🔍 Searching CPT with individual keyword: "chronic"
[Redis] Cache MISS for cpt code: search:chronic
🔍 PostgreSQL lookup for CPT with keyword: "chronic"
🔍 Searching CPT with individual keyword: "diarrhea"
[Redis] Cache MISS for cpt code: search:diarrhea
🔍 PostgreSQL lookup for CPT with keyword: "diarrhea"
🔍 Searching CPT with individual keyword: "past"
[Redis] Cache MISS for cpt code: search:past
🔍 PostgreSQL lookup for CPT with keyword: "past"
🔍 Searching CPT with individual keyword: "months"
[Redis] Cache MISS for cpt code: search:months
🔍 PostgreSQL lookup for CPT with keyword: "months"
🔍 Searching CPT with individual keyword: "typically"
[Redis] Cache MISS for cpt code: search:typically
🔍 PostgreSQL lookup for CPT with keyword: "typically"
🔍 Searching CPT with individual keyword: "loose"
[Redis] Cache MISS for cpt code: search:loose
🔍 PostgreSQL lookup for CPT with keyword: "loose"
🔍 Searching CPT with individual keyword: "stools"
[Redis] Cache MISS for cpt code: search:stools
🔍 PostgreSQL lookup for CPT with keyword: "stools"
🔍 Searching CPT with individual keyword: "daily"
[Redis] Cache MISS for cpt code: search:daily
🔍 PostgreSQL lookup for CPT with keyword: "daily"
🔍 Searching CPT with individual keyword: "reports"
[Redis] Cache MISS for cpt code: search:reports
🔍 PostgreSQL lookup for CPT with keyword: "reports"
🔍 Searching CPT with individual keyword: "upper"
[Redis] Cache HIT for cpt code: search:upper
✅ Found 19 CPT results for "upper"
✅ Found 19 CPT results for "upper"
🔍 Searching CPT with individual keyword: "quadrant"
[Redis] Cache HIT for cpt code: search:quadrant
✅ Found 1 CPT results for "quadrant"
✅ Found 1 CPT results for "quadrant"
🔍 Searching CPT with individual keyword: "discomfort"
[Redis] Cache MISS for cpt code: search:discomfort
🔍 PostgreSQL lookup for CPT with keyword: "discomfort"
🔍 Searching CPT with individual keyword: "after"
[Redis] Cache HIT for cpt code: search:after
✅ Found 2 CPT results for "after"
✅ Found 2 CPT results for "after"
🔍 Searching CPT with individual keyword: "meals"
[Redis] Cache MISS for cpt code: search:meals
🔍 PostgreSQL lookup for CPT with keyword: "meals"
🔍 Searching CPT with individual keyword: "noted"
[Redis] Cache MISS for cpt code: search:noted
🔍 PostgreSQL lookup for CPT with keyword: "noted"
🔍 Searching CPT with individual keyword: "darkening"
[Redis] Cache MISS for cpt code: search:darkening
🔍 PostgreSQL lookup for CPT with keyword: "darkening"
🔍 Searching CPT with individual keyword: "skin"
[Redis] Cache MISS for cpt code: search:skin
🔍 PostgreSQL lookup for CPT with keyword: "skin"
🔍 Searching CPT with individual keyword: "knuckles"
[Redis] Cache MISS for cpt code: search:knuckles
🔍 PostgreSQL lookup for CPT with keyword: "knuckles"
🔍 Searching CPT with individual keyword: "neck"
[Redis] Cache MISS for cpt code: search:neck
🔍 PostgreSQL lookup for CPT with keyword: "neck"
[Redis] Cached cpt code: search:neck
[Redis] Cached 15 CPT results for "neck"
✅ Found 15 CPT results for "neck"
🔍 Searching CPT with individual keyword: "folds"
[Redis] Cache MISS for cpt code: search:folds
🔍 PostgreSQL lookup for CPT with keyword: "folds"
🔍 Searching CPT with individual keyword: "recent"
[Redis] Cache MISS for cpt code: search:recent
🔍 PostgreSQL lookup for CPT with keyword: "recent"
🔍 Searching CPT with individual keyword: "work"
[Redis] Cache HIT for cpt code: search:work
✅ Found 2 CPT results for "work"
✅ Found 2 CPT results for "work"
🔍 Searching CPT with individual keyword: "shows"
[Redis] Cache MISS for cpt code: search:shows
🔍 PostgreSQL lookup for CPT with keyword: "shows"
🔍 Searching CPT with individual keyword: "mildly"
[Redis] Cache MISS for cpt code: search:mildly
🔍 PostgreSQL lookup for CPT with keyword: "mildly"
🔍 Searching CPT with individual keyword: "elevated"
[Redis] Cache MISS for cpt code: search:elevated
🔍 PostgreSQL lookup for CPT with keyword: "elevated"
🔍 Searching CPT with individual keyword: "ferritin"
[Redis] Cache MISS for cpt code: search:ferritin
🔍 PostgreSQL lookup for CPT with keyword: "ferritin"
🔍 Searching CPT with individual keyword: "transaminases"
[Redis] Cache MISS for cpt code: search:transaminases
🔍 PostgreSQL lookup for CPT with keyword: "transaminases"
🔍 Searching CPT with individual keyword: "family"
[Redis] Cache MISS for cpt code: search:family
🔍 PostgreSQL lookup for CPT with keyword: "family"
🔍 Searching CPT with individual keyword: "history"
[Redis] Cache MISS for cpt code: search:history
🔍 PostgreSQL lookup for CPT with keyword: "history"
🔍 Searching CPT with individual keyword: "significant"
[Redis] Cache MISS for cpt code: search:significant
🔍 PostgreSQL lookup for CPT with keyword: "significant"
🔍 Searching CPT with individual keyword: "father"
[Redis] Cache MISS for cpt code: search:father
🔍 PostgreSQL lookup for CPT with keyword: "father"
🔍 Searching CPT with individual keyword: "cirrhosis"
[Redis] Cache MISS for cpt code: search:cirrhosis
🔍 PostgreSQL lookup for CPT with keyword: "cirrhosis"
🔍 Searching CPT with individual keyword: "unknown"
[Redis] Cache MISS for cpt code: search:unknown
🔍 PostgreSQL lookup for CPT with keyword: "unknown"
🔍 Searching CPT with individual keyword: "cause"
[Redis] Cache MISS for cpt code: search:cause
🔍 PostgreSQL lookup for CPT with keyword: "cause"
🔍 Searching CPT with individual keyword: "order"
[Redis] Cache MISS for cpt code: search:order
🔍 PostgreSQL lookup for CPT with keyword: "order"
🔍 Searching CPT with individual keyword: "abdominal"
[Redis] Cache HIT for cpt code: search:abdominal
✅ Found 12 CPT results for "abdominal"
✅ Found 12 CPT results for "abdominal"
🔍 Searching CPT with individual keyword: "evaluate"
[Redis] Cache MISS for cpt code: search:evaluate
🔍 PostgreSQL lookup for CPT with keyword: "evaluate"
🔍 Searching CPT with individual keyword: "possible"
[Redis] Cache MISS for cpt code: search:possible
🔍 PostgreSQL lookup for CPT with keyword: "possible"
🔍 Searching CPT with individual keyword: "gallbladder"
[Redis] Cache HIT for cpt code: search:gallbladder
✅ Found 1 CPT results for "gallbladder"
✅ Found 1 CPT results for "gallbladder"
🔍 Searching CPT with individual keyword: "disease"
[Redis] Cache MISS for cpt code: search:disease
🔍 PostgreSQL lookup for CPT with keyword: "disease"
🔍 Searching CPT with individual keyword: "ultrasound"
[Redis] Cache HIT for cpt code: search:ultrasound
✅ Found 28 CPT results for "ultrasound"
✅ Found 28 CPT results for "ultrasound"
POSTGRES - Found 83 procedure codes
Redis caching enabled
👉 Redis caching EXPLICITLY ENABLED for mappings lookup
Session check: No auth header
9:19:47 PM [express] GET /api/auth/session 200 in 1ms :: {"authenticated":false}
POSTGRES - Found 0 appropriateness mappings
POSTGRES - Found 0 markdown documents
💾 Caching database context in Redis for future use
[Redis] Cached context code: pgcontext:IjQ4LXllYXItb2xkIGZl
✅ Successfully cached database context
[Redis] Cache HIT for context code: pgcontext:IjQ4LXllYXItb2xkIGZl
✅ Cache verification successful - Entry was saved correctly
[Redis] Cached context code: pgcontext:fullresult:IjQ4LXllYXItb2xkIGZl
9:19:53 PM [express] POST /api/debug6/validate 200 in 11303ms :: {"timings":{"keywordExtraction":2.4…


{
  "model": "claude-3-7-sonnet-20250219",
  "max_tokens": 4000,
  "system": "You are RadValidator, an AI clinical decision support system for radiology order validation.\n\nYour task is to analyze a physician's dictation for a radiology order and produce the following outputs:\n1. Extract relevant ICD-10 diagnosis codes\n2. Extract or suggest appropriate CPT procedure codes \n3. Validate if the imaging order is clinically appropriate\n4. Assign a compliance score from 1-9 (9 being most appropriate)\n5. Provide brief educational feedback if the order is inappropriate\n\nThe dictation is for a patient with the specialty context: General Radiology.\n\n\nPOSTGRESQL DATABASE CONTEXT:\nPOSSIBLE DIAGNOSES (from PostgreSQL database):\n- C47.4: Malignant neoplasm of peripheral nerves of abdomen (confidence: 80%)\n- C49.4: Malignant neoplasm of connective and soft tissue of abdomen (confidence: 80%)\n- C76.2: Malignant neoplasm of abdomen (confidence: 80%)\n- D21.4: Benign neoplasm of connective and other soft tissue of abdomen (confidence: 80%)\n- D36.15: Benign neoplasm of peripheral nerves and autonomic nervous system of abdomen (confidence: 80%)\n- M79.A3: Nontraumatic compartment syndrome of abdomen (confidence: 80%)\n- M99.09: Segmental and somatic dysfunction of abdomen and other regions (confidence: 80%)\n- M99.19: Subluxation complex (vertebral) of abdomen and other regions (confidence: 80%)\n- M99.29: Subluxation stenosis of neural canal of abdomen and other regions (confidence: 80%)\n- M99.39: Osseous stenosis of neural canal of abdomen and other regions (confidence: 80%)\n\nPOSSIBLE PROCEDURES (from PostgreSQL database):\n- 76376: 3D rendering with interpretation and reporting of computed tomography, magnetic resonance imaging, ultrasound, or other tomographic modality with image postprocessing under concurrent supervision; not requiring image postprocessing on an independent workstation (Multiple (CT, MRI, Ultrasound, or other tomographic modality)) (confidence: 80%)\n- 76881: Ultrasound, extremity, nonvascular, real-time with image documentation; complete (Ultrasound) (confidence: 80%)\n- 76700: Ultrasound, abdominal, complete (Ultrasound) (confidence: 80%)\n- 76705: Ultrasound, abdominal, real time with image documentation; limited (eg, single organ, quadrant, follow-up) (Ultrasound) (confidence: 80%)\n- 76770: Ultrasound, retroperitoneal (e.g., renal, aorta, nodes), real time with image documentation; complete (Ultrasound) (confidence: 80%)\n- 76775: Ultrasound, retroperitoneal; limited (Ultrasound) (confidence: 80%)\n- 76776: Ultrasound, transplanted kidney, real time and duplex Doppler with image documentation (Ultrasound) (confidence: 80%)\n- 76801: Ultrasound, pregnant uterus, real time with image documentation, fetal and maternal evaluation, first trimester (< 14 weeks 0 days), transabdominal approach; single or first gestation (Ultrasound) (confidence: 80%)\n- 76802: Ultrasound, pregnant uterus, real time with image documentation, fetal and maternal evaluation, after first trimester (> or = 14 weeks 0 days), transabdominal approach; each additional gestation (List separately in addition to code for primary procedure) (Ultrasound) (confidence: 80%)\n- 76805: Ultrasound, pregnant uterus, real time with image documentation, fetal and maternal evaluation, after first trimester (> or = 14 weeks 0 days), transabdominal approach; single or first gestation (Ultrasound) (confidence: 80%)\n\nNo appropriateness mappings found in database.\n\nNo medical documentation found in database.\n\n\nIMPORTANT GUIDELINES:\n- Validate based on ACR Appropriateness Criteria and evidence-based guidelines\n- For inappropriate orders, suggest alternative approaches\n- For spine imaging, MRI without contrast is usually sufficient for disc evaluation\n- Acute low back pain (<6 weeks) without red flags should be managed conservatively\n- Red flags include: trauma, cancer history, neurological deficits, infection signs\n\nOnly use contrast when there is a specific indication (infection, tumor, post-surgical).",
  "messages": [
    {
      "role": "user",
      "content": "Please analyze this radiology order dictation:\n\n\"\"48-year-old female with chronic diarrhea for past 4 months, typically 4-5 loose stools daily. Reports upper right quadrant discomfort after meals. Patient has noted darkening of skin on knuckles and neck folds. Recent lab work shows mildly elevated ferritin and transaminases. Family history significant for father with cirrhosis of \"unknown cause.\" Order abdominal ultrasound to evaluate for possible gallbladder disease.\"\n\"\n\nRespond in JSON format with these fields:\n- diagnosisCodes: Array of {code, description} objects\n- procedureCodes: Array of {code, description} objects\n- validationStatus: \"valid\" or \"invalid\"\n- complianceScore: Number 1-9\n- feedback: Brief educational note for inappropriate orders (33 words target length for General Radiology)"
    }
  ]
}

{
  "id": "msg_015Q4VVTCz583AGPpPpCviTa",
  "type": "message",
  "role": "assistant",
  "model": "claude-3-7-sonnet-20250219",
  "content": [
    {
      "type": "text",
      "text": "```json\n{\n  \"diagnosisCodes\": [\n    {\n      \"code\": \"K59.1\",\n      \"description\": \"Functional diarrhea\"\n    },\n    {\n      \"code\": \"R10.13\",\n      \"description\": \"Epigastric pain\"\n    },\n    {\n      \"code\": \"R74.0\",\n      \"description\": \"Nonspecific elevation of levels of transaminase and lactic acid dehydrogenase\"\n    },\n    {\n      \"code\": \"E83.110\",\n      \"description\": \"Hemochromatosis, unspecified\"\n    }\n  ],\n  \"procedureCodes\": [\n    {\n      \"code\": \"76700\",\n      \"description\": \"Ultrasound, abdominal, complete\"\n    }\n  ],\n  \"validationStatus\": \"valid\",\n  \"complianceScore\": 9,\n  \"feedback\": \"Appropriate imaging selection. Abdominal ultrasound is the recommended first-line imaging study for evaluation of right upper quadrant pain and abnormal liver enzymes. Clinical presentation suggests possible hemochromatosis along with gallbladder disease.\"\n}\n```"
    }
  ],
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 1289,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0,
    "output_tokens": 285
  }
}

