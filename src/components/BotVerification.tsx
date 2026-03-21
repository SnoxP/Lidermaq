import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface BotVerificationProps {
  onVerify: (isValid: boolean) => void;
}

export const BotVerification: React.FC<BotVerificationProps> = ({ onVerify }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = async (token: string | null) => {
    setErrorMsg(null);
    if (!token) {
      onVerify(false);
      return;
    }

    try {
      // Use window.location.origin to ensure the request goes to the correct Vercel domain
      const apiUrl = `${window.location.origin}/api/verify-recaptcha`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      console.log("reCAPTCHA server response:", data);
      
      if (data.success) {
        onVerify(true);
      } else {
        onVerify(false);
        setErrorMsg(`Erro de verificação: ${data.message} ${data.errors ? JSON.stringify(data.errors) : ''}`);
      }
    } catch (error: any) {
      console.error('Erro na requisição de verificação do reCAPTCHA:', error);
      onVerify(false);
      setErrorMsg(`Erro de conexão: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <ReCAPTCHA
        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LdP84AsAAAAAFy3BHFmO_rgIezdpoh2DlnWbWMk"}
        onChange={handleVerify}
      />
      {errorMsg && (
        <p className="text-red-500 text-xs mt-2 text-center max-w-xs">{errorMsg}</p>
      )}
    </div>
  );
};
