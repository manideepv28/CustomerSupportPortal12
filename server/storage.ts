import { users, faqs, inquiries, type User, type InsertUser, type Faq, type InsertFaq, type Inquiry, type InsertInquiry } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getFaqs(): Promise<Faq[]>;
  getFaqsByCategory(category: string): Promise<Faq[]>;
  getFaq(id: number): Promise<Faq | undefined>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  
  getInquiries(): Promise<Inquiry[]>;
  getInquiry(id: number): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private faqs: Map<number, Faq>;
  private inquiries: Map<number, Inquiry>;
  private currentUserId: number;
  private currentFaqId: number;
  private currentInquiryId: number;

  constructor() {
    this.users = new Map();
    this.faqs = new Map();
    this.inquiries = new Map();
    this.currentUserId = 1;
    this.currentFaqId = 1;
    this.currentInquiryId = 1;
    
    // Initialize with sample FAQs
    this.initializeFaqs();
  }

  private initializeFaqs() {
    const sampleFaqs: InsertFaq[] = [
      {
        question: "How do I reset my password?",
        answer: "To reset your password, click on the \"Forgot Password\" link on the login page, enter your email address, and follow the instructions sent to your email.",
        category: "account",
        isVisible: true
      },
      {
        question: "How can I update my billing information?",
        answer: "You can update your billing information by navigating to Account Settings > Billing & Payments. From there, you can add, edit, or remove payment methods.",
        category: "billing",
        isVisible: true
      },
      {
        question: "What are your support hours?",
        answer: "Our support team is available Monday through Friday, 9 AM to 6 PM EST. For urgent issues outside these hours, please use our priority support channel.",
        category: "general",
        isVisible: true
      },
      {
        question: "How do I cancel my subscription?",
        answer: "To cancel your subscription, go to Account Settings > Subscription and click \"Cancel Subscription\". Your access will continue until the end of your current billing period.",
        category: "billing",
        isVisible: true
      },
      {
        question: "Is there a mobile app available?",
        answer: "Yes! Our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.",
        category: "general",
        isVisible: true
      },
      {
        question: "How do I troubleshoot login issues?",
        answer: "First, ensure you're using the correct email and password. Clear your browser cache and cookies, or try using an incognito window. If issues persist, contact our support team.",
        category: "technical",
        isVisible: true
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions.",
        category: "billing",
        isVisible: true
      },
      {
        question: "How can I upgrade my account?",
        answer: "You can upgrade your account anytime by going to Account Settings > Subscription and selecting a higher tier plan. Changes take effect immediately.",
        category: "account",
        isVisible: true
      }
    ];

    sampleFaqs.forEach(faq => {
      this.createFaq(faq);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values()).filter(faq => faq.isVisible);
  }

  async getFaqsByCategory(category: string): Promise<Faq[]> {
    return Array.from(this.faqs.values()).filter(
      faq => faq.isVisible && faq.category === category
    );
  }

  async getFaq(id: number): Promise<Faq | undefined> {
    return this.faqs.get(id);
  }

  async createFaq(insertFaq: InsertFaq): Promise<Faq> {
    const id = this.currentFaqId++;
    const faq: Faq = { ...insertFaq, id };
    this.faqs.set(id, faq);
    return faq;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async getInquiry(id: number): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const inquiry: Inquiry = {
      ...insertInquiry,
      id,
      status: "pending",
      createdAt: new Date()
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }
}

export const storage = new MemStorage();
