# LLM Orchestration

**Version:** 1.1 (Added Error Handling Note)
**Date:** 2025-04-11

This document describes how the RadOrderPad backend manages and sequences calls to different Large Language Models (LLMs) for the core order validation task.

---

## 1. Goal

-   Ensure high availability and resilience for the validation service.
-   Leverage the strengths of different models.
-   Provide a mechanism for comparing model performance and potentially optimizing cost/quality.
-   Log interactions for analysis and debugging.

## 2. LLM Provider Configuration

-   API keys and endpoint URLs for supported providers (Anthropic Claude, xAI Grok, OpenAI GPT) are stored securely (AWS Secrets Manager/Parameter Store) and accessed via environment variables.
-   A configuration setting defines the preferred order and enabled models.

## 3. Standard Validation Flow: Sequential Fallback Chain

This is the default operational mode.

1.  **Receive Request:** The `ValidationEngine` receives the dictation text and generated database context.
2.  **Construct Prompts:** System and User prompts are built using the assigned `prompt_template` (`prompt_registry.md`).
3.  **Attempt Primary LLM (Claude 3.7):**
    *   An API call is made to the configured Claude endpoint with the prompts.
    *   A reasonable timeout is set (e.g., 15-30 seconds).
4.  **Evaluate Primary Response:**
    *   **On Success:** If the API returns a successful response (e.g., HTTP 200) within the timeout, and the response content can be parsed into the expected JSON structure, the result is considered valid. Log interaction to `llm_validation_logs` with `status = 'success'`. Proceed to Response Processing.
    *   **On Failure:** If the API call fails (e.g., network error, 5xx error, timeout) or the response is malformed/unparsable:
        *   Log the failure details to `llm_validation_logs` (e.g., `status = 'failed'`, `error_message = 'Timeout'`).
        *   Proceed to Step 5 (Attempt Secondary LLM).
5.  **Attempt Secondary LLM (Grok 3):**
    *   If the primary attempt failed, an API call is made to the configured Grok endpoint using the *same* prompts.
    *   Timeout is applied.
6.  **Evaluate Secondary Response:**
    *   **On Success:** If Grok returns a valid, parsable response: Log interaction to `llm_validation_logs` with `status = 'fallback_success (grok)'`. Proceed to Response Processing.
    *   **On Failure:** Log failure details (`status = 'fallback_failed (grok)'`). Proceed to Step 7 (Attempt Tertiary LLM).
7.  **Attempt Tertiary LLM (GPT-4.0):**
    *   If the secondary attempt failed, an API call is made to the configured GPT endpoint using the *same* prompts.
    *   Timeout is applied.
8.  **Evaluate Tertiary Response:**
    *   **On Success:** If GPT returns a valid, parsable response: Log interaction to `llm_validation_logs` with `status = 'fallback_success (gpt)'`. Proceed to Response Processing.
    *   **On Failure:** Log failure details (`status = 'fallback_failed (gpt)'`). The validation attempt ultimately fails. **The Validation Engine must signal this complete failure back to the calling service (e.g., `/api/orders/validate` handler), which should then return an appropriate error response (e.g., 503 Service Unavailable) to the frontend.**

## 4. Optional Mode: Parallel Processing & Voting (Future Enhancement)

-   **Concept:** For potentially higher accuracy or confidence scoring, especially on complex or override cases.
-   **Flow:**
    1. Send the same prompts to *all* configured LLMs (Claude, Grok, GPT) simultaneously.
    2. Collect responses from all models that succeed within the timeout.
    3. **Compare Outputs:** Analyze the key fields (suggested codes, validation status, score).
    4. **Voting Logic:**
        *   If all models agree -> High confidence result.
        *   If 2 out of 3 agree -> Take the majority result, potentially flag as medium confidence.
        *   If all disagree -> Flag as low confidence, potentially requiring manual review or using a default safe outcome.
-   **Considerations:** Significantly increases API costs and latency (waits for the slowest model). May be enabled selectively via configuration or for specific order types.

## 5. Logging (`llm_validation_logs` - Main DB)

Each LLM API call attempt (whether primary or fallback, success or failure) should generate a log entry containing:

-   `order_id` (Logical FK)
-   `validation_attempt_id` (Logical FK)
-   `user_id`, `organization_id`
-   `llm_provider` (e.g., 'anthropic', 'xai', 'openai')
-   `model_name` (e.g., 'claude-3-7-sonnet-20250219')
-   `prompt_template_id` used
-   `prompt_tokens`, `completion_tokens`, `total_tokens` (If available from API response)
-   `latency_ms` (Time taken for the API call)
-   `status` ('success', 'failed', 'fallback_success (...)', 'fallback_failed (...)')
-   `error_message` (If failed)
-   `raw_response_digest` (Optional, hash/digest of raw response for debugging, non-PHI).
-   `created_at`

## 6. Error Handling

-   Implement robust error handling around each API call (network errors, timeouts, invalid responses, API key issues).
-   Ensure that failure of one LLM gracefully triggers the next in the fallback chain.
-   **Critical Failure:** If all LLMs in the chain fail, the engine must clearly indicate this failure state so the calling API endpoint can return a non-successful HTTP status (e.g., 503) and appropriate error message to the client, preventing the user from proceeding and ensuring no credit is consumed for the failed attempt.
-   Provide meaningful error feedback to the user if all LLMs fail.