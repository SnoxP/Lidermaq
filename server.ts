import express from "express";
import { createServer as createViteServer } from "vite";
import fetch from "node-fetch";

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

      if (data.success) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false, message: "Falha na verificação do reCAPTCHA" });
      }
    } catch (error) {
      console.error("Erro ao verificar reCAPTCHA:", error);
      res.status(500).json({ success: false, message: "Erro interno do servidor" });
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
