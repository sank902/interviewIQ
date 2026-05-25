import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  Brain,
  FileText,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Mic,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-tailored questions",
    desc: "Questions personalized from your resume, role, and experience level.",
  },
  {
    icon: Mic,
    title: "Realistic interview flow",
    desc: "One question at a time, typed answers, live progress, and timer.",
  },
  {
    icon: BarChart3,
    title: "Deep analytics",
    desc: "Confidence, communication, and correctness scored per question.",
  },
  {
    icon: FileText,
    title: "PDF reports",
    desc: "Download a beautifully formatted interview report after every session.",
  },
  {
    icon: Sparkles,
    title: "Improvement coach",
    desc: "Actionable suggestions and a path to your next 10-point gain.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    desc: "Your resume and answers stay in your account. Always.",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    role: "Frontend Engineer @ Stripe",
    quote:
      "Got the offer after 3 sessions. The feedback is uncomfortably accurate.",
  },
  {
    name: "Marcus L.",
    role: "PM @ Airbnb",
    quote:
      "Better than mock interviews with friends — and available at 2am.",
  },
  {
    name: "Aiko T.",
    role: "Data Scientist",
    quote:
      "The PDF report alone is worth the price. Showed it to my mentor.",
  },
];

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6 pt-20 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 glass px-3 py-1 text-xs text-muted-foreground mb-6">
              <Sparkles className="size-3.5 text-accent" />
              Powered by next-gen AI interviewers
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
              Crack your next interview
              <br />
              with an <span className="text-gradient-brand">AI coach</span>.
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Upload your resume, choose a role, and run a realistic mock
              interview. Get scored on confidence, communication, and
              correctness — with a detailed PDF report you can actually act on.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/interview"
                className="group inline-flex items-center gap-2 h-12 rounded-full bg-gradient-brand px-6 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                Start free interview
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center h-12 rounded-full border border-border/60 glass px-6 font-medium hover:bg-secondary/60"
              >
                See pricing
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-1 text-sm text-muted-foreground">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-warning text-warning"
                />
              ))}

              <span className="ml-2">
                Loved by 12,000+ candidates this month
              </span>
            </div>
          </motion.div>

          {/* Hero preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="absolute -inset-1 rounded-3xl bg-gradient-brand opacity-30 blur-2xl" />

            <div className="relative glass rounded-3xl p-6 md:p-8 shadow-elegant">
              <div className="flex items-center gap-2 mb-6">
                <span className="size-2.5 rounded-full bg-red-500" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-400" />

                <span className="ml-3 text-xs text-muted-foreground">
                  interviewiq.app / interview
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 rounded-2xl bg-secondary/40 p-5 border border-border/60">
                  <div className="text-xs uppercase tracking-wider text-accent">
                    Question 3 of 5
                  </div>

                  <p className="mt-3 text-lg">
                    "Walk me through how you would design a real-time chat
                    system that scales to 10M concurrent users."
                  </p>

                  <div className="mt-6 h-32 rounded-xl bg-background/60 border border-border/60 p-3 text-sm text-muted-foreground">
                    Type your answer…
                  </div>
                </div>

                <div className="rounded-2xl bg-secondary/40 p-5 border border-border/60 space-y-4">
                  {[
                    { label: "Confidence", v: 88 },
                    { label: "Communication", v: 76 },
                    { label: "Correctness", v: 82 },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {s.label}
                        </span>

                        <span className="font-medium">{s.v}</span>
                      </div>

                      <div className="mt-1.5 h-1.5 rounded-full bg-background/60 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s.v}%` }}
                          transition={{ duration: 1.2, delay: 0.6 }}
                          className="h-full bg-gradient-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-semibold tracking-tight">
            Everything you need to win the interview
          </h2>

          <p className="mt-3 text-muted-foreground">
            A complete prep loop — practice, measure, improve, repeat.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative rounded-2xl glass p-6 hover:border-primary/40 transition-colors"
            >
              <div className="size-11 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow mb-4">
                <f.icon className="size-5 text-primary-foreground" />
              </div>

              <h3 className="text-lg font-semibold">{f.title}</h3>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center mb-12">
          Candidates who got the offer
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl glass p-6"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className="size-4 fill-warning text-warning"
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed">"{t.quote}"</p>

              <div className="mt-5 pt-4 border-t border-border/60">
                <div className="font-medium text-sm">{t.name}</div>

                <div className="text-xs text-muted-foreground">
                  {t.role}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-20">
        <div className="relative rounded-3xl overflow-hidden glass p-10 md:p-14 text-center">
          <div className="absolute inset-0 bg-gradient-brand opacity-20" />

          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
              Your next offer is one session away.
            </h2>

            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Run your first mock interview in under 2 minutes. No card
              required.
            </p>

            <Link
              to="/interview"
              className="mt-8 inline-flex items-center gap-2 h-12 rounded-full bg-gradient-brand px-8 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              Start now
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;