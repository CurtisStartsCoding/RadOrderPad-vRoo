-- verify_prompt_insertion.sql
-- Script to verify the successful insertion of the default prompt template
-- Date: 2025-04-13

\echo '==================================================='
\echo 'RadOrderPad Default Prompt Template Verification'
\echo '==================================================='

-- Count records in prompt_templates table
\echo '\nCounting records in prompt_templates table:'
\echo '---------------------------------------------------'
SELECT COUNT(*) AS prompt_templates_count FROM prompt_templates;

-- Display basic information about the inserted template
\echo '\n\nBasic information about prompt templates:'
\echo '---------------------------------------------------'
SELECT 
    id, 
    name, 
    type, 
    version, 
    word_limit, 
    active, 
    created_at, 
    updated_at 
FROM prompt_templates;

-- Display a preview of the content_template
\echo '\n\nContent template preview (first 200 characters):'
\echo '---------------------------------------------------'
SELECT 
    id, 
    name, 
    LEFT(content_template, 200) || '...' AS content_preview 
FROM prompt_templates;

\echo '\n==================================================='
\echo 'Verification complete!'
\echo '==================================================='