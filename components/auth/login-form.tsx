"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // DEMO MODE: Simple bypass - ANY credentials work!
    if (email && password) {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 300));
      router.push("/dashboard");
      router.refresh();
      return;
    }
    
    // If fields empty, show error
    setError("Please enter email and password");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="email" className="text-gray-700 font-medium">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg" 
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}

