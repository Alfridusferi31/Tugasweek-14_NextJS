// pages/api/auth.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { action, name, email, password } = req.body;

    if (action === "register") {
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const { password: passwordDB, ...user } = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        res.json({ user });
      } catch (err) {
        res.status(400).json({ message: "User already exists" });
      }
    } else if (action === "login") {
      try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(200).json({ token });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
