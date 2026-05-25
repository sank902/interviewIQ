import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Sparkles,
  Trophy,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ServerUrl } from "../App";

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/get-interview",
          { withCredentials: true }
        );

        setInterviews(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMyInterviews();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative flex-1 overflow-hidden py-16">
        
        {/* Background */}
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">

          {/* Top */}
          <div className="flex flex-wrap items-start gap-5 mb-14">

            <button
              onClick={() => navigate("/")}
              className="
                size-12
                rounded-2xl
                glass
                border border-border/60
                flex items-center justify-center
                hover:bg-secondary/60
                transition-colors
              "
            >
              <ArrowLeft className="size-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 glass px-4 py-1.5 text-xs text-muted-foreground mb-5">
                <Sparkles className="size-3.5 text-accent" />
                Track your interview performance
              </div>

              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
                Interview
                <span className="text-gradient-brand"> History</span>
              </h1>

              <p className="mt-4 text-muted-foreground max-w-2xl">
                Review your previous AI interviews, analyze scores,
                and improve performance over time.
              </p>
            </div>
          </div>

          {/* Empty state */}
          {interviews.length === 0 ? (
            <div className="glass border border-border/60 rounded-3xl p-16 text-center">
              <div className="size-20 mx-auto rounded-full bg-gradient-brand flex items-center justify-center shadow-glow mb-6">
                <Sparkles className="size-8 text-white" />
              </div>

              <h2 className="text-2xl font-semibold">
                No interviews yet
              </h2>

              <p className="mt-3 text-muted-foreground">
                Start your first AI interview to begin tracking
                performance insights.
              </p>

              <button
                onClick={() => navigate("/interview")}
                className="
                  mt-8
                  h-12
                  px-8
                  rounded-2xl
                  bg-gradient-brand
                  text-white
                  font-medium
                  shadow-glow
                "
              >
                Start Interview
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {interviews.map((item, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/report/${item._id}`)}
                  className="
                    group
                    glass
                    border border-border/60
                    rounded-3xl
                    p-7
                    cursor-pointer
                    transition-all
                    duration-300
                    hover:border-primary
                    hover:shadow-glow
                  "
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                    {/* Left */}
                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3 mb-4">

                        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-1 text-xs font-medium text-white shadow-glow">
                          <Sparkles className="size-3.5" />
                          AI Interview
                        </div>

                        <div
                          className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${
                              item.status === "completed"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20"
                            }
                          `}
                        >
                          {item.status}
                        </div>
                      </div>

                      <h2 className="text-2xl font-semibold tracking-tight">
                        {item.role}
                      </h2>

                      <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-muted-foreground">

                        <div className="flex items-center gap-2">
                          <CalendarDays className="size-4" />
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString()}
                        </div>

                        <div>
                          Experience: {item.experience}
                        </div>

                        <div>
                          Mode: {item.mode}
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-5">

                      {/* Score */}
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <Trophy className="size-4 text-yellow-400" />

                          <span className="text-sm text-muted-foreground">
                            Overall Score
                          </span>
                        </div>

                        <h3 className="text-4xl font-bold text-gradient-brand">
                          {item.finalScore || 0}
                          <span className="text-xl text-muted-foreground">
                            /10
                          </span>
                        </h3>
                      </div>

                      {/* Arrow */}
                      <div className="size-12 rounded-2xl glass border border-border/60 flex items-center justify-center group-hover:bg-secondary/60 transition-colors">
                        <ChevronRight className="size-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default InterviewHistory;