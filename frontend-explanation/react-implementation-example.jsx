// This is a sample React implementation of the RadOrderPad validation workflow
// It demonstrates how to interact with the API endpoints described in the api-workflow-guide.md

import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas'; // For signature capture

// Base URL for API requests
const API_BASE_URL = 'https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api';

// Component for the entire validation workflow
function ValidationWorkflow() {
  // Authentication state
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  
  // Workflow state
  const [currentStep, setCurrentStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [patientInfo, setPatientInfo] = useState({
    id: 1,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    pidn: ''
  });
  const [dictationText, setDictationText] = useState('');
  
  // Validation results
  const [validationResult, setValidationResult] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  // Signature canvas reference
  const signatureCanvasRef = useRef(null);
  
  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      setCurrentStep('patientInfo');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle patient info form submission
  const handlePatientInfoSubmit = (e) => {
    e.preventDefault();
    setCurrentStep('dictation');
  };
  
  // Handle dictation form submission
  const handleDictationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dictationText,
          patientInfo
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Validation failed');
      }
      
      const data = await response.json();
      setValidationResult(data.validationResult);
      setOrderId(data.orderId);
      setCurrentStep('validationResults');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle order finalization
  const handleFinalizeOrder = async () => {
    if (!signatureCanvasRef.current) {
      setError('Signature is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Get signature as base64 data URL
    const signatureData = signatureCanvasRef.current.toDataURL();
    
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          signature: signatureData,
          status: 'pending_admin',
          finalValidationStatus: validationResult.validationStatus,
          finalCPTCode: validationResult.suggestedCPTCodes[0].code,
          clinicalIndication: validationResult.feedback,
          finalICD10Codes: validationResult.suggestedICD10Codes.map(code => code.code),
          referring_organization_name: user?.organization?.name || "Test Referring Practice"
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Order finalization failed');
      }
      
      const data = await response.json();
      setCurrentStep('orderFinalized');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear signature canvas
  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
    }
  };
  
  // Render different steps based on current workflow step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'login':
        return (
          <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        );
        
      case 'patientInfo':
        return (
          <div className="patient-info-form">
            <h2>Patient Information</h2>
            <form onSubmit={handlePatientInfoSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={patientInfo.firstName}
                  onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={patientInfo.lastName}
                  onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={patientInfo.dateOfBirth}
                  onChange={(e) => setPatientInfo({ ...patientInfo, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  value={patientInfo.gender}
                  onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pidn">Patient Identifier Number</label>
                <input
                  type="text"
                  id="pidn"
                  value={patientInfo.pidn}
                  onChange={(e) => setPatientInfo({ ...patientInfo, pidn: e.target.value })}
                />
              </div>
              <button type="submit">Next: Enter Dictation</button>
            </form>
          </div>
        );
        
      case 'dictation':
        return (
          <div className="dictation-form">
            <h2>Clinical Dictation</h2>
            <form onSubmit={handleDictationSubmit}>
              <div className="form-group">
                <label htmlFor="dictation">Enter Clinical Dictation</label>
                <textarea
                  id="dictation"
                  rows="10"
                  value={dictationText}
                  onChange={(e) => setDictationText(e.target.value)}
                  placeholder="Example: 72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy."
                  required
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Validating...' : 'Validate Dictation'}
              </button>
            </form>
          </div>
        );
        
      case 'validationResults':
        return (
          <div className="validation-results">
            <h2>Validation Results</h2>
            <div className="result-card">
              <h3>Validation Status: {validationResult.validationStatus}</h3>
              <div className="compliance-score">
                Compliance Score: {validationResult.complianceScore}/10
              </div>
              <div className="feedback">
                <h4>Clinical Feedback:</h4>
                <p>{validationResult.feedback}</p>
              </div>
              <div className="codes">
                <h4>Suggested CPT Codes:</h4>
                <ul>
                  {validationResult.suggestedCPTCodes.map(code => (
                    <li key={code.code}>
                      <strong>{code.code}</strong>: {code.description}
                    </li>
                  ))}
                </ul>
                <h4>Suggested ICD-10 Codes:</h4>
                <ul>
                  {validationResult.suggestedICD10Codes.map(code => (
                    <li key={code.code}>
                      <strong>{code.code}</strong>: {code.description}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="signature-section">
                <h4>Physician Signature:</h4>
                <SignatureCanvas
                  ref={signatureCanvasRef}
                  penColor="black"
                  canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
                />
                <button onClick={clearSignature}>Clear Signature</button>
              </div>
              <button onClick={handleFinalizeOrder} disabled={loading}>
                {loading ? 'Finalizing...' : 'Finalize Order'}
              </button>
            </div>
          </div>
        );
        
      case 'orderFinalized':
        return (
          <div className="order-finalized">
            <h2>Order Finalized Successfully</h2>
            <div className="success-message">
              <p>Order #{orderId} has been finalized and is pending administrative review.</p>
              <p>The order has been updated with the following information:</p>
              <ul>
                <li><strong>CPT Code:</strong> {validationResult.suggestedCPTCodes[0].code}</li>
                <li><strong>ICD-10 Codes:</strong> {validationResult.suggestedICD10Codes.map(code => code.code).join(', ')}</li>
                <li><strong>Clinical Indication:</strong> {validationResult.feedback}</li>
                <li><strong>Referring Organization:</strong> {user?.organization?.name || "Test Referring Practice"}</li>
              </ul>
            </div>
            <button onClick={() => setCurrentStep('patientInfo')}>Start New Order</button>
          </div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="validation-workflow">
      <header>
        <h1>RadOrderPad</h1>
        {user && (
          <div className="user-info">
            <span>Logged in as: {user.first_name} {user.last_name}</span>
            <button onClick={() => {
              setToken('');
              setUser(null);
              setCurrentStep('login');
            }}>Logout</button>
          </div>
        )}
      </header>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')}>Dismiss</button>
        </div>
      )}
      
      <main>
        {renderCurrentStep()}
      </main>
    </div>
  );
}

export default ValidationWorkflow;