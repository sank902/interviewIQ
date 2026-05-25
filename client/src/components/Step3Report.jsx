import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import Navbar from "./Navbar"


import {
  ArrowLeft,
  Download,
} from "lucide-react"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts"

import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar'

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import 'react-circular-progressbar/dist/styles.css'

function Step3Report({ report }) {
  const navigate = useNavigate()

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-sans">
        Loading Report...
      </div>
    )
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
    role = "Software Engineer",
    createdAt,
  } = report

  // Recharts Data Mapping
  const chartData = questionWiseScore.map((item, index) => ({
    name: `Q${index + 1}`,
    score: item.score || 0,
  }))

  const metrics = [
    { label: "Confidence", v: confidence, color: "oklch(0.66 0.22 295)" },
    { label: "Communication", v: communication, color: "oklch(0.78 0.15 210)" },
    { label: "Correctness", v: correctness, color: "oklch(0.74 0.18 155)" },
  ]

  // Your original PDF logic exactly as it was
  const downloadPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text("Interview Performance Report", 20, 20)

    doc.setFontSize(14)
    doc.text(`Final Score: ${finalScore}/10`, 20, 40)
    doc.text(`Confidence: ${confidence}/10`, 20, 55)
    doc.text(`Communication: ${communication}/10`, 20, 70)
    doc.text(`Correctness: ${correctness}/10`, 20, 85)

    autoTable(doc, {
      startY: 100,
      head: [["Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q) => [
        q.question,
        q.score,
        q.feedback,
      ]),
    })

    doc.save("Interview_Report.pdf")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">

  <div className="fixed top-0 left-0 w-full z-50">
    <Navbar />
  </div>
      <main className="flex-1 mx-auto w-full max-w-7xl px-6 md:px-10 pt-36 pb-20">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/history')} 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back to history
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center gap-2 h-11 rounded-full bg-gradient-brand px-5 text-sm font-medium text-primary-foreground shadow-glow hover:scale-[1.03] transition-transform cursor-pointer border-none"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xs uppercase tracking-wider text-accent">{role}</div>
          <h1 className="text-4xl font-semibold tracking-tight mt-1">Interview Analytics</h1>
          <p className="mt-1 text-muted-foreground">Detailed AI insights based on your interview performance.</p>
        </motion.div>

        {/* Score Grid */}
        <div className="mt-8 grid lg:grid-cols-4 gap-5">
          {/* Main Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.05 }}
            className="lg:col-span-1 glass rounded-2xl p-6 flex flex-col items-center justify-center"
          >
            <div className="w-44 h-44">
              <CircularProgressbar
                value={finalScore * 10} // Converting /10 to percentage
                text={`${finalScore}`}
                styles={buildStyles({
                  pathColor: "oklch(0.66 0.22 295)",
                  trailColor: "oklch(0.27 0.03 270)",
                  textColor: "oklch(0.97 0.01 260)",
                  textSize: "26px",
                })}
              />
            </div>
            <div className="mt-4 text-sm text-muted-foreground">Final Score</div>
          </motion.div>

          {/* Sub Metrics Cards */}
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass rounded-2xl p-6 flex items-center gap-5"
              >
                <div className="w-20 h-20 shrink-0">
                  <CircularProgressbar
                    value={m.v * 10} // Converting /10 to percentage
                    text={`${m.v}`}
                    styles={buildStyles({
                      pathColor: m.color, 
                      trailColor: "oklch(0.27 0.03 270)",
                      textColor: "oklch(0.97 0.01 260)", 
                      textSize: "28px",
                    })}
                  />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                  <div className="text-2xl font-semibold">{m.v}<span className="text-base text-muted-foreground">/10</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-6 grid lg:grid-cols-2 gap-5">
          {/* Trend Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Performance trend</h3>
            <p className="text-xs text-muted-foreground mb-4">Score progression across interview questions.</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.66 0.22 295)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.66 0.22 295)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(0.30 0.03 270 / 0.4)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="oklch(0.70 0.02 270)" fontSize={12} />
                  <YAxis stroke="oklch(0.70 0.02 270)" fontSize={12} domain={[0, 10]} />
                  <Tooltip contentStyle={{ background: "oklch(0.20 0.025 270)", border: "1px solid oklch(0.30 0.03 270)", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="oklch(0.66 0.22 295)" fill="url(#area)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Question-wise breakdown</h3>
            <p className="text-xs text-muted-foreground mb-4">Compare strengths across all answers.</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="oklch(0.30 0.03 270 / 0.4)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="oklch(0.70 0.02 270)" fontSize={12} />
                  <YAxis stroke="oklch(0.70 0.02 270)" fontSize={12} domain={[0, 10]} />
                  <Tooltip contentStyle={{ background: "oklch(0.20 0.025 270)", border: "1px solid oklch(0.30 0.03 270)", borderRadius: 12 }} />
                  <Bar dataKey="score" fill="oklch(0.78 0.15 210)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Per-Question Detailed Feedback */}
        <div className="mt-6 glass rounded-2xl p-6">
          <h3 className="font-semibold mb-5">Detailed Question Feedback</h3>
          <div className="space-y-4">
            {questionWiseScore.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border/60 bg-background/40 p-5"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Question {i + 1}</div>
                    <div className="mt-1 font-medium text-lg leading-relaxed">{q.question}</div>
                    <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="text-accent font-medium mb-1 block">AI Feedback:</span>
                      {q.feedback || "No feedback available."}
                    </div>
                  </div>
                  <div className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${
                    q.score >= 8.5 ? "bg-success/20 text-success" :
                    q.score >= 6.5 ? "bg-accent/20 text-accent" : "bg-warning/20 text-warning"
                  }`}>
                    {q.score}/10
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}

export default Step3Report