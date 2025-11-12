import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';  // <-- import the same client

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const BRAND_COLOR = '#8B5CF6';

  const handleSubmit = async () => {
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');               // <-- go to your protected home page
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#2a2a2a',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <svg width="100" height="100" viewBox="0 0 200 200" style={{ margin: '0 auto' }}>
            <path
              d="M100 20 C140 20 180 40 180 80 L140 80 C140 60 120 50 100 50 C80 50 60 60 60 80 L20 80 C20 40 60 20 100 20 Z"
              fill="#DC143C"
            />
            <rect x="20" y="85" width="160" height="15" fill="#333333" />
            <rect x="20" y="100" width="160" height="15" fill="#F5F5F5" />
            <path
              d="M100 180 C60 180 20 160 20 120 L60 120 C60 140 80 150 100 150 C120 150 140 140 140 120 L180 120 C180 160 140 180 100 180 Z"
              fill="#1E40AF"
            />
          </svg>
        </div>

        <h1 style={{ fontSize: '32px', color: 'white', marginBottom: '8px', textAlign: 'center', fontWeight: 600 }}>
          مرحباً بعودتك
        </h1>
        <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '32px', textAlign: 'center' }}>
          سجل دخولك للمتابعة
        </p>

        {error && (
          <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '16px' }}>{error}</p>
        )}

        {/* Email */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', textAlign: 'right' }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="بريدك الإلكتروني"
            style={{
              width: '100%',
              padding: '14px 16px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              outline: 'none',
              textAlign: 'right',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', textAlign: 'right' }}>
            كلمة المرور
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              style={{
                width: '100%',
                padding: '14px 48px 14px 16px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #444',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                textAlign: 'right',
                boxSizing: 'border-box',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: BRAND_COLOR,
              fontSize: '12px',
              cursor: 'pointer',
            }}
            onClick={() => alert('سيتم إضافة هذه الميزة قريباً')}
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: BRAND_COLOR,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
        </button>

        {/* Signup link */}
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginTop: '24px' }}>
          ليس لديك حساب؟{' '}
          <button
            type="button"
            onClick={() => router.push('/signup')}
            style={{
              background: 'none',
              border: 'none',
              color: BRAND_COLOR,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;