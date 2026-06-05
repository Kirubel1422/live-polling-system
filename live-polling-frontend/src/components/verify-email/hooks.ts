import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyEmailMutation } from '@/api/auth.api';

export function useVerifyEmailHandler(token: string | null) {
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const hasAttempted = useRef(false);

  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verify = async () => {
      try {
        const response = await verifyEmail(token).unwrap();
        
        setStatus('success');
        setMessage(response.message || 'Your email has been verified!');
        setTimeout(() => navigate('/dashboard'), 3000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.data?.message || err?.message || 'Verification failed. The link might be expired.');
      }
    };

    verify();
  }, [token, navigate, verifyEmail]);

  return { status, message };
}
