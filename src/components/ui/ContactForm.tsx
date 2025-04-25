"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) => {
    const { id, value }= e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Form submission logic would go here
    console.log("Form submitted:", formData)
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
    // Show success message or handle errors
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-400">
            Your Name
          </Label>
          <Input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-black/60 border-gray-700 text-white focus:ring-2 focus:ring-purple-500"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-400">
            Your Email
          </Label>
          <Input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-black/60 border-gray-700 text-white focus:ring-2 focus:ring-purple-500"
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-sm font-medium text-gray-400">
          Subject
        </Label>
        <Input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          className="bg-black/60 border-gray-700 text-white focus:ring-2 focus:ring-purple-500"
          placeholder="Project Opportunity"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-gray-400">
          Message
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="bg-black/60 border-gray-700 text-white focus:ring-2 focus:ring-purple-500"
          placeholder="Your message here..."
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105"
      >
        Send Message
      </Button>
    </form>
  )
}
