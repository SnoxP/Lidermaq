import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface BotVerificationProps {
  onVerificationChange: (isValid: boolean) => void;
}

export const BotVerification: React.FC<BotVerificationProps> = ({ onVerificationChange }) => {
  const handleVerify = async (token: string | null) => {
    if (!token) {
      onVerificationChange(false);
      return;
    }

    try {
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      onVerificationChange(data.success);
    } catch (error) {
      console.error('Erro na verificação do reCAPTCHA:', error);
      onVerificationChange(false);
    }
  };

  return (
    <div className="flex justify-center my-4">
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LdP84AsAAAAAFy3BHFmO_rgIezdpoh2DlnWbWMk"}
        onChange={handleVerify}
      />
    </div>
  );
};
