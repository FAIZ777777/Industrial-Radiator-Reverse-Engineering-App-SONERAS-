import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

const SignUpPage = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 

  const BRAND_COLOR = '#8B5CF6';

  const handleSubmit = async () => {
    if (!agree) return alert('يجب الموافقة على الشروط');
    if (!form.email || !form.password || !form.username || !form.phone) return;

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
          phone: form.phone,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user) {
      // Insert profile row (optional, see SQL below)
      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          username: form.username,
          phone: form.phone,
        });

      if (profileErr) {
        console.error(profileErr);
      }
      router.push('/signin');
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
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#2a2a2a',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          margin: '20px 0',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <svg width="80" height="80" viewBox="0 0 200 200" style={{ margin: '0 auto' }}>
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
          إنشاء حساب جديد
        </h1>
        <p style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '32px', textAlign: 'center' }}>
          انضم إلينا اليوم
        </p>

        {error && <p style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

        {/* Phone */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', textAlign: 'right' }}>
            رقم الهاتف
          </label>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                borderRight: '1px solid #444',
                fontSize: '14px',
                color: 'white',
              }}
            >
              🇩🇿 +213
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="رقم الهاتف"
              style={{
                flex: 1,
                padding: '14px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                textAlign: 'right',
              }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', textAlign: 'right' }}>
            كلمة المرور
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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

        {/* Username */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', textAlign: 'right' }}>
            الاسم
          </label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="الاسم"
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

        {/* Email */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: 'white', marginBottom: '8px', textAlign: 'right' }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="البريد الإلكتروني"
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

        {/* Terms */}
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '24px', gap: '12px' }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            style={{
              marginTop: '4px',
              cursor: 'pointer',
              accentColor: BRAND_COLOR,
              width: '16px',
              height: '16px',
            }}
          />
          <label
            style={{
              flex: 1,
              fontSize: '12px',
              color: '#9ca3af',
              textAlign: 'right',
              lineHeight: '1.5',
            }}
          >
            قرأت وأوافق على{' '}
            <span style={{ color: BRAND_COLOR, cursor: 'pointer' }}>
              سياسة الخصوصية و الإشعارات القانونية للتطبيق
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !agree}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: BRAND_COLOR,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: loading || !agree ? 'not-allowed' : 'pointer',
            opacity: loading || !agree ? 0.5 : 1,
          }}
        >
          {loading ? 'جاري التحميل...' : 'إنشاء حساب'}
        </button>

        {/* Sign-in link */}
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', marginTop: '24px' }}>
          هل لديك حساب من قبل؟{' '}
          <button
            type="button"
            onClick={() => router.push('/signin')}
            style={{
              background: 'none',
              border: 'none',
              color: BRAND_COLOR,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            سجل دخولك
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;