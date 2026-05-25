import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);

      let User = response.user;

      let name = User.displayName;
      let email = User.email;

      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
    }
  };

  return (
    <div
      className={`
        w-full
        ${
          isModel
            ? "py-2"
            : "min-h-screen flex items-center justify-center px-6 py-20"
        }
      `}
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className={`
          relative overflow-hidden
          w-full
          ${
            isModel
              ? "max-w-md rounded-3xl p-8"
              : "max-w-lg rounded-[32px] p-12"
          }
          glass border border-border/60 shadow-elegant
        `}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-brand opacity-10 pointer-events-none" />

        <div className="relative">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="size-11 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="size-5 text-white" />
            </div>

            <h2 className="font-display text-2xl font-bold tracking-tight">
              InterviewIQ
            </h2>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 glass px-4 py-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-accent" />
              AI-powered interview platform
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-center leading-tight">
            Continue your journey
            <br />
            with an{" "}
            <span className="text-gradient-brand">AI coach</span>
          </h1>

          {/* Description */}
          <p className="mt-5 text-center text-muted-foreground leading-relaxed">
            Sign in to start realistic AI mock interviews, track your
            performance, and unlock detailed interview reports.
          </p>

          {/* Google button */}
          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              group
              mt-10
              w-full
              h-14
              rounded-2xl
              bg-gradient-brand
              text-white
              font-medium
              flex items-center justify-center gap-3
              shadow-glow
              transition-all
            "
          >
            <FcGoogle size={22} />

            Continue with Google

            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;