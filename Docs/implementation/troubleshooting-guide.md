# Validation Engine Troubleshooting Guide

This guide provides solutions for common issues that may arise when working with the RadOrderPad Validation Engine.

## Database Connection Issues

### Issue: "database does not exist" error

**Symptoms:**
```
Error connecting to main database: error: database "radorder_main" does not exist
```

**Possible Causes:**
1. Incorrect database connection URL
2. Wrong port number
3. Database not created

**Solutions:**
1. Check the `.env` file for correct database connection URLs:
   ```
   MAIN_DATABASE_URL=postgres://postgres:postgres123@localhost:5433/radorder_main
   PHI_DATABASE_URL=postgres://postgres:postgres123@localhost:5433/radorder_phi
   ```
2. Verify Docker Compose configuration has the correct port mapping:
   ```yaml
   ports:
     - "5433:5432"  # host:container
   ```
3. Ensure databases are created:
   ```bash
   docker exec -it radorderpad-postgres psql -U postgres -c "\l"
   ```
4. Restart Docker containers:
   ```bash
   docker-compose down --volumes --remove-orphans
   docker-compose up -d
   ```

### Issue: "password authentication failed" error

**Symptoms:**
```
Error connecting to main database: error: password authentication failed for user "postgres"
```

**Possible Causes:**
1. Incorrect password in connection URL
2. PostgreSQL authentication configuration issue

**Solutions:**
1. Check the password in the connection URL
2. Verify PostgreSQL authentication settings:
   ```bash
   docker exec -it radorderpad-postgres cat /var/lib/postgresql/data/pg_hba.conf
   ```

## Validation Engine Issues

### Issue: "No active default prompt template found" error

**Symptoms:**
```
Error in validation process: Error: No active default prompt template found
```

**Possible Causes:**
1. No prompt template with `type = 'default'` and `active = true`
2. Incorrect query in `getActivePromptTemplate` function

**Solutions:**
1. Check if a default prompt template exists:
   ```bash
   docker exec -it radorderpad-postgres psql -U postgres -d radorder_main -c "SELECT * FROM prompt_templates WHERE type = 'default' AND active = true"
   ```
2. Create or update a prompt template:
   ```bash
   docker exec -it radorderpad-postgres psql -U postgres -d radorder_main -c "UPDATE prompt_templates SET type = 'default' WHERE id = 1"
   ```
3. Verify the `getActivePromptTemplate` function in `src/utils/database-context.ts`:
   ```typescript
   const result = await queryMainDb(
     `SELECT * FROM prompt_templates
      WHERE type = 'default' AND active = true
      ORDER BY created_at DESC
      LIMIT 1`
   );
   ```

### Issue: "Cannot read properties of null (reading 'toString')" error

**Symptoms:**
```
Error in validation process: TypeError: Cannot read properties of null (reading 'toString')
```

**Possible Causes:**
1. Null value in `wordLimit` parameter of `constructPrompt` function
2. Other null values in prompt construction

**Solutions:**
1. Update the `constructPrompt` function to handle null values:
   ```typescript
   prompt = prompt.replace('{{WORD_LIMIT}}', wordLimit != null ? wordLimit.toString() : '500');
   ```
2. Add null checks for other parameters:
   ```typescript
   prompt = prompt.replace('{{DATABASE_CONTEXT}}', databaseContext || '');
   prompt = prompt.replace('{{DICTATION_TEXT}}', sanitizedText || '');
   ```

### Issue: "null value in column violates not-null constraint" error

**Symptoms:**
```
Error handling validation request: error: null value in column "patient_id" of relation "orders" violates not-null constraint
```

**Possible Causes:**
1. Missing required fields in order creation
2. Incorrect parameter passing

**Solutions:**
1. Ensure all required fields are provided in the request:
   ```json
   {
     "dictationText": "test",
     "patientInfo": { "id": 1 },
     "radiologyOrganizationId": 1
   }
   ```
2. Update the `createDraftOrder` function to handle required fields:
   ```typescript
   if (!patientId) {
     throw new Error('Patient ID is required');
   }
   ```

## LLM API Issues

### Issue: LLM API key not set

**Symptoms:**
```
Error calling Anthropic Claude API: Error: ANTHROPIC_API_KEY not set
```

**Possible Causes:**
1. Missing API key in `.env` file
2. Environment variable not loaded

**Solutions:**
1. Add API keys to `.env` file:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   GROK_API_KEY=your_grok_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```
2. Restart the server to load new environment variables

### Issue: LLM API timeout

**Symptoms:**
```
Error calling Anthropic Claude API: AbortError: The operation was aborted due to timeout
```

**Possible Causes:**
1. LLM API is slow or unresponsive
2. Timeout value is too low

**Solutions:**
1. Increase the timeout value in `.env` file:
   ```
   LLM_TIMEOUT=60000  # 60 seconds
   ```
2. Check LLM API status and try again later

### Issue: LLM response parsing error

**Symptoms:**
```
Failed to parse JSON, generating default response
```

**Possible Causes:**
1. LLM response is not in valid JSON format
2. LLM response contains unexpected content

**Solutions:**
1. Check the prompt template to ensure it requests JSON format
2. Update the `processLLMResponse` function to handle malformed responses:
   ```typescript
   try {
     parsedResponse = JSON.parse(jsonContent);
   } catch (parseError) {
     console.log("Failed to parse JSON, generating default response");
     // Generate a default response
   }
   ```

## Performance Issues

### Issue: Slow validation response times

**Symptoms:**
- Validation requests take a long time to complete
- High latency in LLM API calls

**Possible Causes:**
1. LLM API latency
2. Inefficient database queries
3. Large prompt size

**Solutions:**
1. Optimize database queries:
   - Add indexes to frequently queried columns
   - Limit the number of rows returned
2. Reduce prompt size:
   - Limit the amount of context included
   - Use more targeted keyword extraction
3. Implement caching for frequently used database contexts

## Logging and Monitoring

### Issue: Missing validation logs

**Symptoms:**
- Validation attempts are not being logged
- Missing entries in `validation_attempts` table

**Possible Causes:**
1. Error in logging function
2. Database connection issues
3. Missing required fields

**Solutions:**
1. Check the `logValidationAttempt` function in `src/services/validation.service.ts`
2. Verify database connection for PHI database
3. Ensure all required fields are provided for logging

### Issue: "relation does not exist" error for logging tables

**Symptoms:**
```
Error logging LLM usage: error: relation "llm_validation_logs" does not exist
```

**Possible Causes:**
1. Table not created in database
2. Schema mismatch

**Solutions:**
1. Create the missing table:
   ```sql
   CREATE TABLE IF NOT EXISTS llm_validation_logs (
     id SERIAL PRIMARY KEY,
     provider VARCHAR(50) NOT NULL,
     model VARCHAR(100) NOT NULL,
     prompt_tokens INTEGER,
     completion_tokens INTEGER,
     total_tokens INTEGER,
     latency_ms INTEGER,
     created_at TIMESTAMP NOT NULL DEFAULT NOW()
   )
   ```
2. Update the schema to match the expected structure

## Testing

### Issue: Test validation requests failing

**Symptoms:**
- Test validation requests return errors
- Unexpected validation results

**Possible Causes:**
1. Missing test data
2. Configuration issues
3. Code changes breaking functionality

**Solutions:**
1. Ensure test data is properly set up:
   - Test prompt templates
   - Test patient records
   - Test user accounts
2. Check configuration for test environment
3. Run unit tests to identify specific issues:
   ```bash
   npm run test
   ```

## Common Commands

Here are some useful commands for troubleshooting:

### Database Commands

```bash
# List databases
docker exec -it radorderpad-postgres psql -U postgres -c "\l"

# List tables in radorder_main
docker exec -it radorderpad-postgres psql -U postgres -d radorder_main -c "\dt"

# List tables in radorder_phi
docker exec -it radorderpad-postgres psql -U postgres -d radorder_phi -c "\dt"

# Check prompt templates
docker exec -it radorderpad-postgres psql -U postgres -d radorder_main -c "SELECT * FROM prompt_templates"

# Check prompt assignments
docker exec -it radorderpad-postgres psql -U postgres -d radorder_main -c "SELECT * FROM prompt_assignments"

# Check validation attempts
docker exec -it radorderpad-postgres psql -U postgres -d radorder_phi -c "SELECT * FROM validation_attempts"
```

### Server Commands

```bash
# Start the server with environment variables
$env:MAIN_DATABASE_URL="postgres://postgres:postgres123@localhost:5433/radorder_main"; $env:PHI_DATABASE_URL="postgres://postgres:postgres123@localhost:5433/radorder_phi"; npm run dev

# Test the health endpoint
curl -v http://localhost:3000/health

# Test the validation endpoint
Invoke-WebRequest -Uri "http://localhost:3000/api/orders/validate" -Method POST -Headers @{"Authorization"="Bearer YOUR_TOKEN_HERE"; "Content-Type"="application/json"} -Body '{"dictationText":"test", "patientInfo": {"id": 1}, "radiologyOrganizationId": 1}'
```

### Docker Commands

```bash
# Restart Docker containers
docker-compose down --volumes --remove-orphans
docker-compose up -d

# Check Docker container logs
docker logs radorderpad-postgres

# Check Docker container status
docker ps
```

## Contact Support

If you continue to experience issues after trying these troubleshooting steps, please contact the development team with the following information:

1. Detailed description of the issue
2. Steps to reproduce
3. Error messages and logs
4. Environment details (OS, Node.js version, etc.)
5. Screenshots or screen recordings (if applicable)