import React, { useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { Upload, FileText, ArrowRight, Sparkles } from "lucide-react"

import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Step1SetUp({ onStart }) {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("Mid-Senior");
    const [mode, setMode] = useState("Technical");

    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");

    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const handleUploadResume = async (e) => {
        if (e) e.stopPropagation();
        if (!resumeFile || analyzing) return;

        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(
                ServerUrl + "/api/interview/resume",
                formdata,
                { withCredentials: true }
            )

            setRole(result.data.role || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");

            setAnalysisDone(true);
            setAnalyzing(false);

        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        setLoading(true)

        try {
            const result = await axios.post(
                ServerUrl + "/api/interview/generate-questions",
                { role, experience, mode, resumeText, projects, skills },
                { withCredentials: true }
            )

            if (userData) {
                dispatch(
                    setUserData({
                        ...userData,
                        credits: result.data.creditsLeft
                    })
                )
            }

            setLoading(false)
            onStart(result.data)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        /* FIX: Added min-h-screen and bg-background here to enforce the dark theme! */
        <div className="min-h-screen w-full bg-background text-foreground font-sans flex flex-col items-center pt-20">
            <motion.div
                initial={{ opacity: 0, y: 16 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -16 }}
                className="w-full max-w-5xl mx-auto px-4 md:px-6 py-12"
            >
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-accent" /> Step 1 of 2
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground">Set up your interview</h1>
                    <p className="mt-3 text-muted-foreground">We'll personalize questions to your resume and target role.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                    
                    {/* LEFT CARD: Target Role & Experience */}
                    <div className="glass rounded-2xl p-6">
                        <h3 className="font-semibold mb-4 text-foreground">Target role</h3>
                        <input
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Senior Frontend Engineer"
                            className="w-full h-11 rounded-xl bg-background/60 border border-border/60 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
                        />
                        
                        <h3 className="font-semibold mt-6 mb-3 text-foreground">Experience level</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {["Junior", "Mid-Senior", "Staff+"].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setExperience(l)}
                                    className={`h-10 rounded-xl border text-sm transition-all cursor-pointer ${
                                        experience === l
                                            ? "bg-gradient-brand text-primary-foreground border-transparent shadow-glow"
                                            : "border-border/60 bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT CARD: Resume Upload & Analysis */}
                    <div className="glass rounded-2xl p-6">
                        <h3 className="font-semibold mb-4 text-foreground">
                            {analysisDone ? "Resume Analysis" : "Upload resume (PDF)"}
                        </h3>
                        
                        {!analysisDone ? (
                            <label
                                className={`flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed cursor-pointer transition-colors relative ${
                                    resumeFile ? "border-primary/60 bg-primary/5" : "border-border/60 hover:border-primary/50 bg-background/40"
                                }`}
                            >
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => setResumeFile(e.target.files[0])}
                                />
                                {resumeFile ? (
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-brand flex items-center justify-center mb-3">
                                            <FileText className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <div className="text-sm font-medium text-foreground">{resumeFile.name}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {resumeFile.size ? (resumeFile.size / 1024).toFixed(0) : 0} KB · click to replace
                                        </div>
                                        
                                        <div className="absolute -bottom-4">
                                            <button
                                                onClick={handleUploadResume}
                                                disabled={analyzing}
                                                className="h-9 px-4 rounded-full bg-accent text-accent-foreground text-xs font-semibold shadow-glow-cyan hover:scale-[1.05] transition-transform flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
                                            >
                                                {analyzing ? (
                                                    <>
                                                        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Analyzing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-3.5 h-3.5" /> Analyze Resume
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                        <div className="text-sm text-foreground">Drop your resume or click to browse</div>
                                        <div className="text-xs text-muted-foreground mt-1">PDF only · up to 5 MB</div>
                                    </>
                                )}
                            </label>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                className="bg-background/40 border border-border/60 rounded-xl p-5 max-h-44 overflow-y-auto custom-scrollbar"
                            >
                                {projects.length > 0 && (
                                    <div className="mb-5">
                                        <h4 className="text-accent text-sm font-medium mb-3 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Extracted Projects
                                        </h4>
                                        <div className="space-y-2">
                                            {projects.map((p, i) => (
                                                <div key={i} className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                                                    {p}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div>
                                        <h4 className="text-accent text-sm font-medium mb-3 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" /> Detected Skills
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((s, i) => (
                                                <span key={i} className="bg-accent/10 border border-accent/20 text-accent px-2.5 py-1 rounded-md text-[11px] font-medium">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        <p className="text-xs text-muted-foreground mt-4">
                            Skipping the resume is fine — we'll use generic questions for {role || "your role"}.
                        </p>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleStart}
                        disabled={!role || loading}
                        className="group inline-flex items-center gap-2 h-12 rounded-full bg-gradient-brand px-7 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer border-none"
                    >
                        {loading ? "Starting..." : "Begin interview"}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default Step1SetUp