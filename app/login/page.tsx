"use client";

import { useState } from "react";
import { Car } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // DEMO MODE - ANY credentials work!
    if (email && password) {
      setLoading(true);
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Use window.location for more reliable redirect
      window.location.href = '/dashboard';
      return;
    }
    
    alert("Please enter email and password");
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
          background: 'linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #dbeafe 100%)'
    }}>
      <div style={{ width: '100%', maxWidth: '448px', padding: '32px' }}>
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '16px',
            marginBottom: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Car style={{ width: '32px', height: '32px', color: 'white' }} />
          </div>
          <h2 style={{
            fontSize: '30px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #2563eb, #1e40af)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            padding: 0
          }}>
            ASMS
          </h2>
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>
            Ashraf Sugar Mills Employees Vehicle Management System
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 25px rgba(0,0,0,0.1)',
          padding: '32px',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
              Welcome Back
            </h3>
            <p style={{ fontSize: '14px', color: '#4b5563' }}>
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#9ca3af' : 'linear-gradient(90deg, #2563eb, #1e40af)',
                color: 'white',
                fontWeight: '600',
                padding: '12px 16px',
                borderRadius: '6px',
                boxShadow: loading ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #1e40af, #1e3a8a)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb, #1e40af)';
                }
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            Powered by Supabase & Next.js
          </p>
        </div>
      </div>
    </div>
  );
}
