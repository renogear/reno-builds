import React, { useState, useRef } from 'react';

// Modular, context-aware, Playwright-friendly form component
export default function DealCurationForm({ webhookUrl = 'https://your-n8n-instance.com/webhook/deal-curation' }) {
  // Form state
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const firstErrorRef = useRef(null);

  // Validation helpers
  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!city) errors.city = 'City is required';
    if (!investmentRange) errors.investmentRange = 'Investment range is required';
    if (!strategy) errors.strategy = 'Strategy is required';
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      // Focus the first invalid field
      if (firstErrorRef.current) firstErrorRef.current.focus();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, city, investmentRange, strategy })
      });
      if (!response.ok) throw new Error('Failed to submit.');
      setSuccess(true);
      setEmail('');
      setCity('');
      setInvestmentRange('');
      setStrategy('');
      setFieldErrors({});
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <form
      className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
      onSubmit={handleSubmit}
      data-testid="deal-curation-form"
      aria-label="Deal Curation Form"
      noValidate
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Get Curated Real Estate Deals</h2>
      <div>
        <label htmlFor="email" className="block font-medium mb-1">Email</label>
        <input
          id="email"
          type="email"
          className={`w-full border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-primary focus:border-primary`}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          data-testid="input-email"
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? 'error-email' : undefined}
          ref={fieldErrors.email ? firstErrorRef : null}
        />
        {fieldErrors.email && (
          <div id="error-email" className="text-red-600 text-sm mt-1" aria-live="polite">{fieldErrors.email}</div>
        )}
      </div>
      <div>
        <label htmlFor="city" className="block font-medium mb-1">City</label>
        <input
          id="city"
          type="text"
          className={`w-full border ${fieldErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-primary focus:border-primary`}
          value={city}
          onChange={e => setCity(e.target.value)}
          required
          data-testid="input-city"
          aria-invalid={!!fieldErrors.city}
          aria-describedby={fieldErrors.city ? 'error-city' : undefined}
          ref={fieldErrors.city && !fieldErrors.email ? firstErrorRef : null}
        />
        {fieldErrors.city && (
          <div id="error-city" className="text-red-600 text-sm mt-1" aria-live="polite">{fieldErrors.city}</div>
        )}
      </div>
      <div>
        <label htmlFor="investmentRange" className="block font-medium mb-1">Investment Range</label>
        <select
          id="investmentRange"
          className={`w-full border ${fieldErrors.investmentRange ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-primary focus:border-primary`}
          value={investmentRange}
          onChange={e => setInvestmentRange(e.target.value)}
          required
          data-testid="input-investment-range"
          aria-invalid={!!fieldErrors.investmentRange}
          aria-describedby={fieldErrors.investmentRange ? 'error-investmentRange' : undefined}
          ref={fieldErrors.investmentRange && !fieldErrors.email && !fieldErrors.city ? firstErrorRef : null}
        >
          <option value="">Select range</option>
          <option value="under-100k">Under $100,000</option>
          <option value="100k-250k">$100,000 - $250,000</option>
          <option value="250k-500k">$250,000 - $500,000</option>
          <option value="500k-1m">$500,000 - $1,000,000</option>
          <option value="over-1m">Over $1,000,000</option>
        </select>
        {fieldErrors.investmentRange && (
          <div id="error-investmentRange" className="text-red-600 text-sm mt-1" aria-live="polite">{fieldErrors.investmentRange}</div>
        )}
      </div>
      <div>
        <label htmlFor="strategy" className="block font-medium mb-1">Strategy</label>
        <select
          id="strategy"
          className={`w-full border ${fieldErrors.strategy ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-primary focus:border-primary`}
          value={strategy}
          onChange={e => setStrategy(e.target.value)}
          required
          data-testid="input-strategy"
          aria-invalid={!!fieldErrors.strategy}
          aria-describedby={fieldErrors.strategy ? 'error-strategy' : undefined}
          ref={fieldErrors.strategy && !fieldErrors.email && !fieldErrors.city && !fieldErrors.investmentRange ? firstErrorRef : null}
        >
          <option value="">Select strategy</option>
          <option value="buy-and-hold">Buy & Hold</option>
          <option value="fix-and-flip">Fix & Flip</option>
          <option value="wholesaling">Wholesaling</option>
          <option value="multifamily">Multifamily</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land Development</option>
        </select>
        {fieldErrors.strategy && (
          <div id="error-strategy" className="text-red-600 text-sm mt-1" aria-live="polite">{fieldErrors.strategy}</div>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center"
        disabled={loading}
        data-testid="submit-btn"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            Submitting...
          </span>
        ) : (
          'Submit'
        )}
      </button>
      {success && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center mt-4" data-testid="success-message" aria-live="polite">
          Thank you! Your preferences have been submitted.
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-center mt-4" data-testid="error-message" aria-live="polite">
          {error}
        </div>
      )}
    </form>
  );
} 