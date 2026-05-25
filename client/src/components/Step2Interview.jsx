import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices
      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92;     // slightly slower than normal
      utterance.pitch = 1.05;    // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic()
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        // If last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }

    }

    runIntro()

  }, [selectedVoice, isIntroPhase, currentIndex])

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0;
        }
        return prev - 1

      })
    }, 1000);

    return () => clearInterval(timer)

  }, [isIntroPhase, currentIndex])

  useEffect(() => {
  if (!isIntroPhase && currentQuestion) {
    setTimeLeft(currentQuestion.timeLimit || 60);
  }
}, [currentIndex]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;

  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch { }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic()
    setIsSubmitting(true)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
      } , {withCredentials:true})

      setFeedback(result.data.feedback)
      speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
console.log(error)
setIsSubmitting(false)
    }
  }

  const handleNext =async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
   
  }

  const finishInterview = async () => {
    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl+ "/api/interview/finish" , { interviewId} , {withCredentials:true})

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }

   useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer()
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);


  // ==========================================
  // UPDATED UI: EXACT SAME LAYOUT, NEW DARK CSS
  // ==========================================
  return (
    <div className='min-h-screen bg-background custom-grid-bg text-foreground font-sans flex items-center justify-center p-4 sm:p-6 pt-24'>
      
      {/* Main Glass Container */}
      <div className='w-full max-w-6xl min-h-[80vh] bg-glass rounded-[32px] shadow-elegant border border-border/60 flex flex-col lg:flex-row overflow-hidden backdrop-blur-xl'>

        {/* LEFT COLUMN: Video Section */}
        <div className='w-full lg:w-[35%] bg-black/20 flex flex-col items-center p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-border/60'>
          
          <div className='w-full max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-lg'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className='w-full max-w-md bg-background/60 border border-border/60 rounded-xl p-4 shadow-sm backdrop-blur-md'>
              <p className='text-foreground text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}

          {/* Timer & Stats Area */}
          <div className='w-full max-w-md bg-background/40 border border-border/60 rounded-2xl shadow-md p-6 space-y-5 backdrop-blur-md'>
            
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground font-medium'>
                Interview Status
              </span>
              <span className={`text-sm font-semibold transition-colors ${isAIPlaying ? "text-primary animate-pulse" : "text-transparent"}`}>
                {isAIPlaying ? "AI Speaking" : "Listening..."}
              </span>
            </div>

            <div className="h-px bg-white/10"></div>

            <div className='flex justify-center'>
              {/* Inherits text-foreground, ensure Timer component doesn't hardcode black text */}
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className="h-px bg-white/10"></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-primary'>{currentIndex + 1}</span>
                <span className='block mt-1 text-xs text-muted-foreground uppercase tracking-wider'>Current</span>
              </div>
              <div>
                <span className='text-2xl font-bold text-primary'>{questions.length}</span>
                <span className='block mt-1 text-xs text-muted-foreground uppercase tracking-wider'>Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Text Section */}
        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          
          <div className='flex items-center gap-3 mb-6'>
            <span className='text-accent'>✦</span>
            <h2 className='text-xl sm:text-2xl font-semibold tracking-tight text-foreground'>
              AI Smart Interview
            </h2>
          </div>

          {!isIntroPhase && (
            <div className='relative mb-6 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 shadow-sm'>
              <p className='text-xs sm:text-sm text-primary uppercase tracking-wider font-medium mb-3'>
                Question {currentIndex + 1} of {questions.length}
              </p>
              <div className='text-base sm:text-xl font-medium text-foreground leading-relaxed'>
                {currentQuestion?.question}
              </div>
            </div>
          )}

          <textarea
            placeholder={isIntroPhase ? "Wait for the AI to finish speaking..." : "Type your answer here or speak clearly into the mic..."}
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            disabled={isIntroPhase}
            className="flex-1 bg-black/20 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-white/10 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground custom-scrollbar" 
          />

          {!feedback ? (
            <div className='flex items-center gap-4 mt-6'>
              
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full border shadow-lg transition-colors ${
                  isMicOn 
                    ? "bg-secondary text-foreground border-white/10" 
                    : "bg-destructive/20 text-destructive border-destructive/30"
                }`}
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20}/>}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting || isIntroPhase}
                whileTap={{ scale: 0.95 }}
                className='flex-1 h-12 sm:h-14 bg-brand text-primary-foreground rounded-2xl shadow-glow hover:scale-[1.02] transition-all font-semibold disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center'
              >
                {isSubmitting ? "Submitting Analysis..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-6 bg-accent/10 border border-accent/20 p-5 rounded-2xl shadow-sm'
            >
              <div className='flex items-center gap-2 mb-3'>
                <span className='text-accent'>✦</span>
                <p className='text-accent font-semibold'>AI Feedback</p>
              </div>
              <p className='text-foreground font-medium mb-6 leading-relaxed'>{feedback}</p>

              <button
                onClick={handleNext}
                className='w-full h-12 sm:h-14 bg-brand text-primary-foreground rounded-xl shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 font-semibold'
              >
                Next Question <BsArrowRight size={20}/>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2Interview