import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Sparkles,
  Zap,
  Crown,
} from "lucide-react";

import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Pricing() {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loadingPlan, setLoadingPlan] = useState(null);

  const dispatch = useDispatch();

  const plans = [
    {
      id: "free",
      name: "Free",
      icon: Sparkles,
      price: "₹0",
      credits: 100,
      description:
        "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },

    {
      id: "basic",
      name: "Starter",
      icon: Zap,
      price: "₹100",
      credits: 150,
      description:
        "Great for focused practice and rapid skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },

    {
      id: "pro",
      name: "Pro",
      icon: Crown,
      price: "₹500",
      credits: 650,
      description:
        "Best value for serious candidates preparing for top companies.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Most Popular",
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);

      const amount =
        plan.id === "basic"
          ? 100
          : plan.id === "pro"
          ? 500
          : 0;

      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amount,
          credits: plan.credits,
        },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewIQ.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,

        handler: async function (response) {
          const verifypay = await axios.post(
            ServerUrl + "/api/payment/verify",
            response,
            { withCredentials: true }
          );

          dispatch(setUserData(verifypay.data.user));

          alert("Payment Successful 🎉 Credits Added!");

          navigate("/");
        },

        theme: {
          color: "#8b5cf6",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.open();

      setLoadingPlan(null);
    } catch (error) {
      console.log(error);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">

          {/* Back */}
          <button
            onClick={() => navigate("/")}
            className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </button>

          {/* Heading */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 glass px-4 py-1.5 text-xs text-muted-foreground mb-6">
              <Sparkles className="size-3.5 text-accent" />
              Flexible pricing for every candidate
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
              Invest in your
              <br />
              <span className="text-gradient-brand">
                interview success
              </span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Practice smarter, improve faster, and land your dream
              role with AI-powered interview coaching.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid lg:grid-cols-3 gap-6 mt-20">

            {plans.map((plan, i) => {
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  onClick={() =>
                    !plan.default && setSelectedPlan(plan.id)
                  }
                  className={`
                    relative
                    rounded-3xl
                    border
                    p-8
                    transition-all
                    duration-300
                    glass
                    ${
                      isSelected
                        ? "border-primary shadow-glow"
                        : "border-border/60"
                    }
                  `}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute top-5 right-5 rounded-full bg-gradient-brand px-4 py-1 text-xs font-medium text-white shadow-glow">
                      {plan.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className="size-14 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow mb-6">
                    <plan.icon className="size-6 text-white" />
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-semibold">
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mt-5 flex items-end gap-2">
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>

                    <span className="text-muted-foreground mb-1">
                      / one-time
                    </span>
                  </div>

                  {/* Credits */}
                  <p className="mt-2 text-accent font-medium">
                    {plan.credits} Credits Included
                  </p>

                  {/* Desc */}
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 size-5 rounded-full bg-gradient-brand flex items-center justify-center shrink-0">
                          <Check className="size-3 text-white" />
                        </div>

                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  {!plan.default ? (
                    <button
                      disabled={loadingPlan === plan.id}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!isSelected) {
                          setSelectedPlan(plan.id);
                        } else {
                          handlePayment(plan);
                        }
                      }}
                      className={`
                        mt-10
                        w-full
                        h-12
                        rounded-2xl
                        font-medium
                        transition-all
                        ${
                          isSelected
                            ? "bg-gradient-brand text-white shadow-glow"
                            : "glass border border-border/60 hover:bg-secondary/60"
                        }
                      `}
                    >
                      {loadingPlan === plan.id
                        ? "Processing..."
                        : isSelected
                        ? "Proceed to Pay"
                        : "Select Plan"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="mt-10 w-full h-12 rounded-2xl glass border border-border/60 text-muted-foreground"
                    >
                      Current Plan
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Pricing;