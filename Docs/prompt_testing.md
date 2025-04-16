# Prompt Testing Guide

**Version:** 1.0
**Date:** 2025-04-15

This document outlines methodologies and best practices for testing prompt templates before deployment to ensure they produce accurate, consistent, and useful results.

---

## 1. Purpose

- **Quality Assurance:** Ensure prompts produce accurate and consistent results
- **Performance Optimization:** Identify and address inefficiencies in prompts
- **Regression Prevention:** Verify that changes don't break existing functionality
- **Continuous Improvement:** Establish metrics for measuring and improving prompt effectiveness

## 2. Testing Methodologies

### 2.1. Unit Testing

Unit testing focuses on verifying that a prompt produces the expected output format and meets basic requirements.

#### 2.1.1. Format Validation

- **JSON Structure:** Verify that the response is valid JSON
- **Required Fields:** Check that all required fields are present
- **Field Types:** Validate that fields have the correct data types
- **ICD-10 Codes:** Confirm that:
  * At least 3-4 ICD-10 codes are included
  * Each code has the `isPrimary` property
  * Exactly one code has `isPrimary: true`
- **CPT Codes:** Verify that at least one CPT code is included

#### 2.1.2. Content Validation

- **Validation Status:** Check that the status is one of the allowed values
- **Compliance Score:** Verify the score is within the expected range (0-100)
- **Feedback:** Confirm the feedback is appropriate for the validation status
- **Internal Reasoning:** Verify the reasoning is comprehensive and logical

### 2.2. Integration Testing

Integration testing evaluates how the prompt works within the full validation pipeline.

#### 2.2.1. End-to-End Testing

- **Database Context:** Test with real database context
- **Full Pipeline:** Verify the prompt works with the entire validation process
- **Error Handling:** Check how the system handles unexpected prompt responses

#### 2.2.2. Performance Testing

- **Response Time:** Measure the time taken to generate a response
- **Token Usage:** Track the number of tokens used
- **Cost Analysis:** Calculate the cost per validation

### 2.3. A/B Testing

A/B testing compares different prompt versions to determine which performs better.

#### 2.3.1. Setup

- **Test Groups:** Define user groups for each prompt version
- **Assignment:** Randomly assign users to test groups
- **Duration:** Set an appropriate test duration (typically 1-4 weeks)
- **Sample Size:** Ensure sufficient sample size for statistical significance

#### 2.3.2. Metrics

- **Validation Accuracy:** Percentage of validations that match expert review
- **Override Rate:** Frequency of physician overrides
- **User Satisfaction:** Feedback ratings from physicians
- **Performance Metrics:** Response time, token usage, cost

#### 2.3.3. Analysis

- **Statistical Significance:** Calculate p-values to determine if differences are significant
- **Effect Size:** Measure the magnitude of differences between versions
- **Segmentation:** Analyze results by organization, specialty, or other factors
- **Qualitative Feedback:** Review user comments and feedback

## 3. Test Case Development

### 3.1. Test Case Categories

Develop a comprehensive set of test cases covering different scenarios:

- **Standard Cases:** Common, straightforward cases
- **Edge Cases:** Unusual or extreme scenarios
- **Error Cases:** Scenarios designed to test error handling
- **Specialty-Specific Cases:** Cases relevant to particular medical specialties
- **Modality-Specific Cases:** Cases for different imaging modalities

### 3.2. Test Case Structure

Each test case should include:

- **Patient Case:** The dictation text
- **Expected Output:** The expected validation result
- **Test Focus:** What aspect of the prompt is being tested
- **Acceptance Criteria:** Specific conditions that must be met

### 3.3. Test Case Library

Maintain a library of test cases for:

- **Regression Testing:** Verify that changes don't break existing functionality
- **Benchmark Testing:** Compare performance across prompt versions
- **Edge Case Validation:** Ensure the prompt handles unusual scenarios

## 4. Testing Tools

### 4.1. Automated Testing Framework

- **Test Runner:** Executes test cases and collects results
- **Assertion Library:** Validates that responses meet expectations
- **Reporting:** Generates test reports with pass/fail status and metrics

### 4.2. Manual Testing Interface

- **Prompt Test UI:** Interface for testing prompts with custom inputs
- **Response Analyzer:** Tools for examining and validating responses
- **Comparison View:** Side-by-side comparison of different prompt versions

### 4.3. Analytics Dashboard

- **Performance Metrics:** Response time, token usage, cost
- **Accuracy Metrics:** Validation accuracy, override rate
- **Trend Analysis:** Changes in metrics over time
- **A/B Test Results:** Comparison of different prompt versions

## 5. Testing Workflow

### 5.1. Development Testing

During prompt development:

1. **Initial Testing:** Test with a small set of standard cases
2. **Iterative Refinement:** Adjust the prompt based on test results
3. **Edge Case Testing:** Verify handling of unusual scenarios
4. **Performance Optimization:** Identify and address inefficiencies

### 5.2. Pre-Deployment Testing

Before deploying a new prompt:

1. **Comprehensive Testing:** Test with the full test case library
2. **Regression Testing:** Verify that changes don't break existing functionality
3. **Performance Benchmarking:** Compare performance with the current production prompt
4. **Review & Approval:** Submit test results for review and approval

### 5.3. Post-Deployment Monitoring

After deploying a new prompt:

1. **Real-Time Monitoring:** Track performance metrics in production
2. **User Feedback:** Collect and analyze user feedback
3. **Issue Tracking:** Identify and address any issues that arise
4. **Continuous Improvement:** Use insights to inform future prompt updates

## 6. Common Testing Challenges

### 6.1. Subjectivity in Medical Validation

- **Challenge:** Medical validation often involves subjective judgment
- **Solution:** Use consensus from multiple experts as the gold standard
- **Approach:** Define clear criteria for what constitutes a "correct" validation

### 6.2. Handling Model Updates

- **Challenge:** LLM models may be updated, affecting prompt performance
- **Solution:** Maintain version-specific prompts and test across model versions
- **Approach:** Include model version in test results and monitor for changes

### 6.3. Test Data Privacy

- **Challenge:** Test cases may contain sensitive medical information
- **Solution:** Use synthetic or de-identified data for testing
- **Approach:** Implement strict access controls for test data

### 6.4. Measuring Reasoning Quality

- **Challenge:** Difficult to quantify the quality of the internal reasoning
- **Solution:** Develop rubrics for evaluating reasoning comprehensiveness and logic
- **Approach:** Have medical experts review and rate reasoning quality

## 7. Best Practices

### 7.1. Test-Driven Development

- Start with test cases before writing the prompt
- Define clear acceptance criteria for each test case
- Iterate on the prompt until all test cases pass

### 7.2. Comprehensive Test Coverage

- Test across different medical specialties
- Include a diverse range of patient cases
- Cover all validation statuses (appropriate, needs_clarification, inappropriate)

### 7.3. Regular Regression Testing

- Run the full test suite after any prompt changes
- Maintain a baseline of expected results for comparison
- Automate regression testing where possible

### 7.4. Documentation

- Document all test cases and expected results
- Record test outcomes and any issues identified
- Maintain a history of prompt versions and their test results

## 8. Metrics & KPIs

### 8.1. Accuracy Metrics

- **Validation Accuracy:** Percentage of validations that match expert review
- **Primary Code Accuracy:** Percentage of cases with correct primary ICD-10 code
- **CPT Code Accuracy:** Percentage of cases with correct CPT code

### 8.2. Performance Metrics

- **Response Time:** Average time to generate a validation response
- **Token Usage:** Average number of tokens used per validation
- **Cost per Validation:** Average cost based on token usage

### 8.3. User Experience Metrics

- **Override Rate:** Percentage of validations overridden by physicians
- **Satisfaction Rating:** User feedback ratings
- **Feedback Quality:** Assessment of the helpfulness of validation feedback

## 9. Continuous Improvement

### 9.1. Feedback Loop

- Collect user feedback on validation results
- Analyze override patterns to identify improvement opportunities
- Incorporate insights into prompt updates

### 9.2. Performance Optimization

- Identify inefficiencies in prompts
- Test variations to reduce token usage
- Balance accuracy and performance

### 9.3. Knowledge Sharing

- Document lessons learned from testing
- Share best practices across the team
- Build a knowledge base of effective prompt patterns

---

## References

- [Prompt Registry](./prompt_registry.md) - System for managing and versioning prompts
- [Prompt Template Guide](./prompt_template_guide.md) - Guidelines for creating effective prompts
- [Prompt Management UI](./prompt_management_ui.md) - Interface for managing prompts
- [Super Admin Console](./super_admin.md) - Overview of the Super Admin interface