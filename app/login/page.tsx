"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LockClosedIcon, EnvelopeIcon } from "@heroicons/react/24/outline";



export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Login gagal. Silakan coba lagi.");
        } else {
          router.push("/dashboard");
        }
      } catch {
        setError("Terjadi kesalahan server. Coba lagi nanti.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/20 backdrop-blur-md rounded-3xl shadow-xl max-w-md w-full p-10 space-y-8 text-gray-900"
        noValidate
      >
        <h1 className="text-4xl font-extrabold text-center tracking-tight drop-shadow-sm">
          Sign in
        </h1>

        <AnimatePresence>
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-400 bg-red-50 border border-red-400 rounded-md p-3 font-medium shadow-sm"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-600" />
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="Email"
            className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/80 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            disabled={isPending}
            required
          />
        </div>

        <div className="relative">
          <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" />
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/80 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            disabled={isPending}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition 
            ${isPending ? "bg-pink-300 cursor-wait" : "bg-pink-500 hover:bg-pink-600"}`}
        >
          {isPending ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block"
            >
              🔄 Memproses...
            </motion.span>
          ) : (
            "Login"
          )}
        </button>
      </motion.form>
    </div>
  );
}
