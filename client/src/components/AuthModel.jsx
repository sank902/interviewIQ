import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import Auth from "../pages/auth";
import { motion } from "framer-motion";

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 z-[999]
        flex items-center justify-center
        bg-black/70
        backdrop-blur-md
        px-4
      "
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] left-[-120px] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-3xl" />

        <div className="absolute bottom-[-200px] right-[-120px] w-[400px] h-[400px] rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="
            absolute -top-4 -right-4
            z-50
            size-10
            rounded-full
            glass
            border border-border/60
            flex items-center justify-center
            hover:bg-secondary/60
            transition-colors
          "
        >
          <X className="size-4 text-white" />
        </button>

        <Auth isModel={true} />
      </div>
    </motion.div>
  );
}

export default AuthModel;