import express from "express";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";
import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin
let adminAuth: admin.auth.Auth | null = null;

try {
  const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    adminAuth = admin.auth();
    console.log("Firebase Admin inicializado com sucesso via service-account.json");
  } else {
    const serviceAccountEnv = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (serviceAccountEnv.projectId && serviceAccountEnv.clientEmail && serviceAccountEnv.privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountEnv as any),
      });
      adminAuth = admin.auth();
      console.log("Firebase Admin inicializado com sucesso via variáveis de ambiente");
    } else {
      console.warn("Aviso: Credenciais do Firebase Admin não encontradas.");
    }
  }
} catch (error) {
  console.error("Erro ao inicializar Firebase Admin:", error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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
    if (!adminAuth) {
      return res.status(500).json({ success: false, message: "Firebase Admin não inicializado" });
    }
    try {
      await adminAuth.deleteUser(uid);
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ success: false, message: "Erro ao deletar usuário do Firebase Auth" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
