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
      const apiUrl = `/api/verify-recaptcha`;
      console.log("Calling reCAPTCHA API:", apiUrl);
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      console.log("reCAPTCHA server response:", data);
      
      if (data.success) {
        console.log("reCAPTCHA success, calling onVerify(true)");
        onVerify(true);
      } else {
        console.log("reCAPTCHA failed, calling onVerify(false)");
        onVerify(false);
        setErrorMsg(`Erro de verificação: ${data.message} ${data.errors ? JSON.stringify(data.errors) : ''}`);
      }
    } catch (error: any) {
      console.error('Erro na requisição de verificação do reCAPTCHA:', error);
      try {
        onVerify(false);
      } catch (e) {
        console.error("Erro ao chamar onVerify:", e);
      }
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
