// pages/api/books.js
import { PrismaClient } from "@prisma/client";
import multer from "multer";

const prisma = new PrismaClient();
const upload = multer({ dest: "uploads/" });

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Handle book creation
    try {
      // Your book creation logic here
      res.status(201).json({ message: "Book created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const books = await prisma.book.findMany();
      res.status(200).json({ books });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
