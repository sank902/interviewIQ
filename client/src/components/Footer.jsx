import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Globe,
  Circle,
} from "lucide-react";
import { circIn } from "framer-motion";
function Footer() {
  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-14">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
                <Sparkles className="size-5 text-white" />
              </div>

              <h2 className="font-display text-2xl font-bold tracking-tight">
                InterviewIQ
              </h2>
            </div>

            <p className="mt-5 text-muted-foreground max-w-md leading-relaxed">
              AI-powered interview preparation platform designed to improve
              communication skills, technical depth, and professional confidence
              through realistic mock interviews and detailed analytics.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4 mt-6">
              {[Globe, Circle, Circle].map((Icon, i) => (
                <button
                  key={i}
                  className="size-10 rounded-full glass flex items-center justify-center hover:bg-secondary/60 transition-colors"
                >
                  <Icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-lg mb-5">Product</h3>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link
                to="/interview"
                className="hover:text-white transition-colors"
              >
                Mock Interview
              </Link>

              <Link
                to="/history"
                className="hover:text-white transition-colors"
              >
                Interview History
              </Link>

              <Link
                to="/pricing"
                className="hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-lg mb-5">Resources</h3>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <button className="text-left hover:text-white transition-colors">
                Resume Tips
              </button>

              <button className="text-left hover:text-white transition-colors">
                Interview Guide
              </button>

              <button className="text-left hover:text-white transition-colors">
                AI Reports
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 InterviewIQ. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button className="hover:text-white transition-colors">
              Privacy
            </button>

            <button className="hover:text-white transition-colors">
              Terms
            </button>

            <button className="hover:text-white transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;