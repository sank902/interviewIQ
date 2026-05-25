import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Coins, LogOut, History, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);

  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      setShowMenu(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/40 glass"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="size-5 text-white" />
            </div>

            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">
                InterviewIQ
              </h1>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>

            <Link to="/interview" className="hover:text-white transition-colors">
              Interview
            </Link>

            <Link to="/history" className="hover:text-white transition-colors">
              History
            </Link>

            <Link to="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            
            {/* Credits */}
            <button
              onClick={() => navigate("/pricing")}
              className="hidden md:flex items-center gap-2 h-10 rounded-full border border-border/60 glass px-4 text-sm hover:bg-secondary/50 transition-colors"
            >
              <Coins className="size-4 text-accent" />
              <span>{userData?.credits || 0}</span>
            </button>

            {/* User */}
            {userData ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="size-11 rounded-full bg-gradient-brand text-white font-semibold shadow-glow flex items-center justify-center"
                >
                  {userData?.name?.slice(0, 1)?.toUpperCase()}
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl glass border border-border/60 p-3 shadow-elegant">
                    <div className="px-3 py-2 border-b border-border/40">
                      <p className="font-medium">{userData?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {userData?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate("/history");
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-secondary/60 transition-colors text-sm"
                    >
                      <History className="size-4" />
                      Interview History
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-sm"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="inline-flex items-center gap-2 h-11 rounded-full bg-gradient-brand px-6 font-medium text-white shadow-glow transition-transform hover:scale-[1.03]"
              >
                <User className="size-4" />
                Sign in
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default Navbar;