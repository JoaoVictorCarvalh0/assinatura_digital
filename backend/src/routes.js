import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import {
  generateRSAKeyPair,
  sha256Hash,
  signHash,
  verifySignature,
} from "./cryptoUtils.js";
import { v4 as uuidv4 } from "uuid";
import { authenticate } from "./middleware/authenticate.js";

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashdedPassword = await bcrypt.hash(password, 10);
    const { publicKey, privateKey } = generateRSAKeyPair();
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashdedPassword,
        publicKey,
        privateKey,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ id: user.id, name: user.name, email: user.email, token });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Erro ao cadastrar usuário", details: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "Usuário ou senha inválidos" });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(404).json({ error: "Usuário ou senha inválidos" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ id: user.id, name: user.name, email: user.email, token });
  } catch (err) {
    res.status(400).json({ error: "Erro ao logar", details: err.message });
  }
});

router.post("/sign", authenticate, async (req, res) => {
  const { userId, text } = req.body;

  try {
    const userIdNumber = Number(userId);
    if (!Number.isInteger(userIdNumber)) {
      return res.status(400).json({ error: "userId inválido" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userIdNumber },
    });
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

router.post("/verify-text", async (req, res) => {
  const { text, signatureBase64 } = req.body;

  if (!text || !signatureBase64) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios: text e signatureBase64" });
  }

  try {
    const hash = sha256Hash(text);

    const signatureRecord = await prisma.signature.findFirst({
      where: { hash },
      include: { user: true },
    });

    if (!signatureRecord) {
      return res
        .status(404)
        .json({ error: "Assinatura não encontrada para este texto" });
    }

    const isValid = verifySignature(
      hash,
      signatureBase64,
      signatureRecord.user.publicKey
    );

    await prisma.log.create({
      data: {
        signatureId: signatureRecord.id,
        status: isValid ? "VÁLIDA" : "INVÁLIDA",
        verifierIp: req.ip,
      },
    });

    return res.json({
      status: isValid ? "VÁLIDA" : "INVÁLIDA",
      signatario: signatureRecord.user.name,
      algoritmo: signatureRecord.algorithm,
      dataHora: signatureRecord.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro na verificação", details: err.message });
  }
});

export default router;
