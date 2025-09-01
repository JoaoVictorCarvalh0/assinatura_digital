import express from "express";
import { PrismaClient } from "@prisma/client";
import {
  generateRSAKeyPair,
  sha256Hash,
  signHash,
  verifySignature,
} from "./cryptoUtils.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { publicKey, privateKey } = generateRSAKeyPair();
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        publicKey,
        privateKey,
      },
    });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Erro ao cadastrar usuário", details: err.message });
  }
});

// Assinatura de texto
router.post("/sign", async (req, res) => {
  const { userId, text } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
    const hash = sha256Hash(text);
    const signature = signHash(hash, user.privateKey);
    const signatureRecord = await prisma.signature.create({
      data: {
        id: uuidv4(),
        text,
        hash,
        signature,
        algorithm: "RSA-SHA256",
        userId: user.id,
      },
    });
    res.json({ signatureId: signatureRecord.id });
  } catch (err) {
    res.status(400).json({ error: "Erro ao assinar", details: err.message });
  }
});

// Verificação pública
router.get("/verify/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const signature = await prisma.signature.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!signature)
      return res.status(404).json({ error: "Assinatura não encontrada" });
    const valid = verifySignature(
      signature.hash,
      signature.signature,
      signature.user.publicKey
    );
    await prisma.log.create({
      data: {
        signatureId: signature.id,
        status: valid ? "VÁLIDA" : "INVÁLIDA",
        verifierIp: req.ip,
      },
    });
    res.json({
      status: valid ? "VÁLIDA" : "INVÁLIDA",
      signatario: signature.user.name,
      algoritmo: signature.algorithm,
      dataHora: signature.createdAt,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Erro na verificação", details: err.message });
  }
});

export default router;
