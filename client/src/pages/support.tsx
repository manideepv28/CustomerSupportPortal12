import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Headphones, List, Mail, MessageCircle, Phone, CheckCircle, CircleAlert, ChevronDown, ChevronRight, PlusCircle, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertInquirySchema, type Faq, type InsertInquiry } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  // Fetch FAQs
  const { data: faqs = [], isLoading: faqsLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs", selectedCategory === "all" ? undefined : selectedCategory].filter(Boolean),
    queryFn: async () => {
      const url = selectedCategory === "all" 
        ? "/api/faqs" 
        : `/api/faqs?category=${selectedCategory}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      return response.json();
    }
  });

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form setup
  const form = useForm<InsertInquiry>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      priority: "low",
      message: "",
      newsletter: false,
    },
  });

  // Submit inquiry mutation
  const submitInquiry = useMutation({
    mutationFn: async (data: InsertInquiry) => {
      const response = await apiRequest("POST", "/api/inquiries", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: InsertInquiry) => {
    submitInquiry.mutate(data);
  };

  const scrollToContact = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const supportTopics = [
    { id: "billing", label: "Billing & Payments", icon: "💳" },
    { id: "technical", label: "Technical Issues", icon: "🔧" },
    { id: "account", label: "Account Management", icon: "👤" },
    { id: "general", label: "General Questions", icon: "❓" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Headphones className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-slate-900">Help Center</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Home</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Documentation</a>
              <a href="#" className="text-blue-600 font-medium">Support</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How can we help you?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Search our knowledge base or get in touch with our support team</p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search FAQs, topics, or keywords..."
                className="w-full pl-12 pr-4 py-4 text-lg bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <List className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Browse Topics</h3>
                    <p className="text-slate-600 text-sm">Explore support categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={scrollToContact}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Submit Inquiry</h3>
                    <p className="text-slate-600 text-sm">Get personalized help</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Live Chat</h3>
                    <p className="text-slate-600 text-sm">Chat with our team</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Filter by:</span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {faqsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border border-slate-200 rounded-xl overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 text-left">
                      <span className="font-medium text-slate-900">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-slate-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {filteredFaqs.length === 0 && !faqsLoading && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-slate-600">No FAQs found matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-4 w-4 text-slate-400 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Email Support</p>
                      <p className="text-slate-600 text-sm">support@company.com</p>
                      <p className="text-xs text-slate-400">Response within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-4 w-4 text-slate-400 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Phone Support</p>
                      <p className="text-slate-600 text-sm">1-800-SUPPORT</p>
                      <p className="text-xs text-slate-400">Mon-Fri, 9 AM - 6 PM EST</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="h-4 w-4 text-slate-400 mt-1" />
                    <div>
                      <p className="font-medium text-slate-900">Live Chat</p>
                      <p className="text-slate-600 text-sm">Available now</p>
                      <Button variant="link" className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto">
                        Start Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Topics */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <List className="h-5 w-5 text-blue-600 mr-2" />
                  Support Topics
                </h3>
                <div className="space-y-2">
                  {supportTopics.map((topic) => (
                    <Button
                      key={topic.id}
                      variant="ghost"
                      className="w-full justify-between p-3 h-auto"
                      onClick={() => setSelectedCategory(topic.id)}
                    >
                      <span className="text-slate-600">{topic.label}</span>
                      <ChevronRight className="h-4 w-4 text-slate-300" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <section className="mt-16" id="contact-form">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Submit an Inquiry</h2>
                <p className="text-slate-600">Can't find what you're looking for? Send us a message and we'll get back to you.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Level</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="low" id="low" />
                              <Label htmlFor="low">Low</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="medium" id="medium" />
                              <Label htmlFor="medium">Medium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="high" id="high" />
                              <Label htmlFor="high">High</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your issue or question in detail..."
                            className="min-h-32 resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Send me updates about new features and improvements
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-slate-400">* Required fields</p>
                    <Button
                      type="submit"
                      disabled={submitInquiry.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {submitInquiry.isPending ? (
                        "Submitting..."
                      ) : (
                        <>
                          Submit Inquiry
                          <Layers className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Support Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Video Tutorials</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Community Forum</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Contact Methods</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Email Support</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Live Chat</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Phone Support</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Priority Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Account Help</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Billing Issues</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Password Reset</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Account Settings</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Subscription Changes</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Status & Updates</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">System Status</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Maintenance Schedule</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Release Notes</a></li>
                <li><a href="#" className="text-slate-600 hover:text-slate-900 transition-colors duration-200">Known Issues</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-slate-600 text-sm">
              &copy; 2024 Company Name. All rights reserved. | 
              <a href="#" className="hover:text-slate-900 transition-colors duration-200"> Privacy Policy</a> | 
              <a href="#" className="hover:text-slate-900 transition-colors duration-200"> Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
