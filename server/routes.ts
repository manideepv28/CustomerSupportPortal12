import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all FAQs
  app.get("/api/faqs", async (req, res) => {
    try {
      const category = req.query.category as string;
      const faqs = category ? await storage.getFaqsByCategory(category) : await storage.getFaqs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  // Submit inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const validationResult = insertInquirySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const errorMessage = fromZodError(validationResult.error);
        return res.status(400).json({ 
          message: "Validation failed",
          errors: errorMessage.toString()
        });
      }

      const inquiry = await storage.createInquiry(validationResult.data);
      res.status(201).json({
        message: "Inquiry submitted successfully",
        inquiry: {
          id: inquiry.id,
          status: inquiry.status
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit inquiry" });
    }
  });

  // Get all inquiries (for admin purposes)
  app.get("/api/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
