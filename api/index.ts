import express from "express";
import fetch from "node-fetch";
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin
let adminAuth: admin.auth.Auth | null = null;

try {
  const serviceAccountEnv = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (serviceAccountEnv.projectId && serviceAccountEnv.clientEmail && serviceAccountEnv.privateKey) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountEnv as any),
      });
    }
    adminAuth = admin.auth();
    console.log("Firebase Admin inicializado com sucesso via variáveis de ambiente");
  } else {
    console.warn("Aviso: Credenciais do Firebase Admin não encontradas.");
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase Admin:", error);
}

const app = express();

app.use(express.json());

// API route to check env vars
app.get("/api/check-env", (req, res) => {
  res.json({
    siteKeySet: !!process.env.VITE_RECAPTCHA_SITE_KEY,
    secretKeySet: !!process.env.RECAPTCHA_SECRET_KEY,
    siteKeyPrefix: process.env.VITE_RECAPTCHA_SITE_KEY ? process.env.VITE_RECAPTCHA_SITE_KEY.substring(0, 5) : null,
    secretKeyPrefix: process.env.RECAPTCHA_SECRET_KEY ? process.env.RECAPTCHA_SECRET_KEY.substring(0, 5) : null,
  });
});

// API route for reCAPTCHA verification
app.post("/api/verify-recaptcha", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token ausente" });
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY || "6LdP84AsAAAAALJ0X1mXBK3E_ojXMWjWil9MXopc";
    if (!secretKey) {
      return res.status(500).json({ success: false, message: "Chave secreta não configurada" });
    }
    
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verifyUrl, { method: "POST" });
    const data = (await response.json()) as any;
    
    console.log("reCAPTCHA verification response:", data);

    if (data.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Falha na verificação do reCAPTCHA", errors: data['error-codes'] });
    }
  } catch (error) {
    console.error("Erro ao verificar reCAPTCHA:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor" });
  }
});

// API route to delete user from Firebase Auth
app.delete("/api/delete-user/:uid", async (req, res) => {
  const { uid } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: "Não autorizado: Token ausente" });
  }

  const idToken = authHeader.split('Bearer ')[1];

  if (!adminAuth) {
    console.warn("Firebase Admin não inicializado. Não foi possível deletar do Auth, mas prosseguindo com a limpeza no Firestore.");
    return res.json({ success: true, message: "Firebase Admin não inicializado. Removendo apenas do Firestore." });
  }
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;
    
    let isAdmin = false;
    if (email === "pedronobreneto27@gmail.com") {
      isAdmin = true;
    } else {
      const db = admin.firestore();
      const adminDoc = await db.collection('admins').doc(email || '').get();
      isAdmin = adminDoc.exists;
    }

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Acesso negado: Apenas administradores podem excluir usuários" });
    }

    await adminAuth.deleteUser(uid);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error);
    if (error.code === 'auth/user-not-found') {
      // Se o usuário já não existe no Auth, consideramos sucesso para permitir que o frontend limpe o Firestore
      return res.json({ success: true, message: "Usuário não encontrado no Auth, prosseguindo com a limpeza." });
    }
    res.status(500).json({ success: false, message: "Erro ao deletar usuário do Firebase Auth" });
  }
});

export default app;
