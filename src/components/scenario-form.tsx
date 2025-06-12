"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Optional if using message textarea
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Optionally send data to an API here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full h-full bg-white rounded-xl p-6 shadow-md space-y-4"
    >
      <div>
        <Label className="mb-2"  htmlFor="name">Numero de compte</Label>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label className="mb-2"  htmlFor="email">Montant Transaction</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label className="mb-2"  htmlFor="message">Nb mois d'inactivite</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
        />
      </div>
       <div>
        <Label className="mb-2" htmlFor="message">Risque</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
        />
      </div>
      <div>
        <Label  className="mb-2" htmlFor="message">Date range</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
        />
      </div>

       <div>
        <Label  className="mb-2" htmlFor="message">Nombrre de lignes a afficher</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
        />
      </div>
      <Button type="submit"     className="rounded-md bg-slate-900 text-white py-2 mt-4 self-center w-full">
        Send
      </Button>
    </form>
  );
}
