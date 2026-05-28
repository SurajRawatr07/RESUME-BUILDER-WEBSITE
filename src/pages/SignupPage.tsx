import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  User,
  Mail,
  Lock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Moon,
  Sun,
  AlertTriangle,
} from "lucide-react";

import { useEffect, useState } from "react";

interface SignupPageProps {
  onSignupSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function SignupPage({
  onSignupSuccess,
  onNavigateToLogin,
}: SignupPageProps) {
  const { signup } = useAuth();

  // =========================
  // STATES
  // =========================

  const [darkMode, setDarkMode] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [focusedField, setFocusedField] =
    useState<string | null>(null);

  const [capsLock, setCapsLock] = useState(false);

  const [passwordStrength, setPasswordStrength] =
    useState(0);

  // =========================
  // EMAIL VALIDATION
  // =========================

  const isValidEmail =
    /\S+@\S+\.\S+/.test(email);

  // =========================
  // PASSWORD RULES
  // =========================

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  // =========================
  // PASSWORD STRENGTH
  // =========================

  useEffect(() => {
    let score = 0;

    if (passwordChecks.length) score++;
    if (passwordChecks.uppercase) score++;
    if (passwordChecks.number) score++;
    if (passwordChecks.symbol) score++;

    setPasswordStrength(score);
  }, [password]);

  // =========================
  // THEME
  // =========================

  const theme = darkMode
    ? {
        background:
          "linear-gradient(135deg,#050816 0%,#0f172a 35%,#111827 65%,#1e1b4b 100%)",

        card: "rgba(10,15,35,0.78)",

        text: "#ffffff",

        subText: "rgba(203,213,225,0.75)",

        input: "rgba(255,255,255,0.05)",

        border: "rgba(255,255,255,0.08)",
      }
    : {
        background:
          "linear-gradient(135deg,#eef2ff 0%,#f8fafc 40%,#ede9fe 70%,#fdf2f8 100%)",

        card: "rgba(255,255,255,0.78)",

        text: "#111827",

        subText: "rgba(71,85,105,0.9)",

        input: "rgba(255,255,255,0.7)",

        border: "rgba(15,23,42,0.08)",
      };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (!isValidEmail) {
      setError("Please enter valid email");
      return;
    }

    if (!passwordChecks.length) {
      setError(
        "Password must be at least 8 characters"
      );
      return;
    }

    if (
      !passwordChecks.uppercase ||
      !passwordChecks.number ||
      !passwordChecks.symbol
    ) {
      setError(
        "Password does not meet security requirements"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const successResult = await signup(
        name,
        email,
        password
      );

      if (successResult) {
        setSuccess(true);

        setTimeout(() => {
          onSignupSuccess();
        }, 1400);
      } else {
        setError(
          "An account with this email already exists"
        );
      }

      setIsLoading(false);
    }, 1200);
  };

  return (
    <div
      className="min-h-dvh relative overflow-hidden flex items-center justify-center px-4 py-6 sm:py-10 transition-all duration-500"
      style={{
        background: theme.background,
      }}
    >
      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 overflow-hidden">

        {/* blob 1 */}
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "999px",
            top: "-120px",
            left: "-100px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* blob 2 */}
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            width: "450px",
            height: "450px",
            borderRadius: "999px",
            top: "0",
            right: "-100px",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* blob 3 */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            borderRadius: "999px",
            bottom: "-120px",
            left: "30%",
            background:
              "radial-gradient(circle, rgba(236,72,153,0.2), transparent 70%)",
            filter: "blur(90px)",
          }}
        />

        {/* grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* ================= THEME TOGGLE ================= */}

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-5 right-5 z-50"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "18px",
          border: `1px solid ${theme.border}`,
          background: theme.card,
          backdropFilter: "blur(20px)",
          color: theme.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {darkMode ? (
          <Sun size={20} />
        ) : (
          <Moon size={20} />
        )}
      </motion.button>

      {/* ================= MAIN CARD ================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative w-full max-w-md z-10"
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            inset: "-3px",
            borderRadius: "34px",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.4), rgba(236,72,153,0.3))",
            filter: "blur(25px)",
            opacity: 0.7,
            zIndex: -1,
          }}
        />

        {/* card */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
          style={{
            background: theme.card,
            backdropFilter: "blur(28px)",
            border: `1px solid ${theme.border}`,
            borderRadius: "32px",
            overflow: "hidden",
            boxShadow: darkMode
              ? "0 25px 80px rgba(0,0,0,0.6)"
              : "0 25px 80px rgba(99,102,241,0.15)",
          }}
          className="p-6 sm:p-8 md:p-9"
        >
          {/* ================= HEADER ================= */}

          <div className="text-center mb-8">

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                mb-5
              "
              style={{
                background:
                  "rgba(99,102,241,0.12)",
                border:
                  "1px solid rgba(99,102,241,0.2)",
                color: "#818cf8",
              }}
            >
              <Sparkles size={14} />

              <span className="text-xs font-semibold">
                AI Powered Resume Builder
              </span>
            </div>

            <h1
              style={{
                color: theme.text,
              }}
              className="
                text-3xl
                sm:text-4xl
                font-extrabold
                mb-3
                tracking-tight
              "
            >
              Create Account
            </h1>

            <p
              style={{
                color: theme.subText,
              }}
              className="
                text-sm
                leading-7
              "
            >
              Join SmartResume and build
              beautiful resumes with modern
              AI tools.
            </p>
          </div>

          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* ERROR */}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  style={{
                    background:
                      "rgba(239,68,68,0.12)",
                    border:
                      "1px solid rgba(239,68,68,0.25)",
                    color: "#f87171",
                    padding: "14px",
                    borderRadius: "16px",
                    fontSize: "13px",
                  }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUCCESS */}

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="mb-2"
                  style={{
                    background:
                      "rgba(34,197,94,0.12)",
                    border:
                      "1px solid rgba(34,197,94,0.3)",
                    color: "#4ade80",
                    padding: "14px",
                    borderRadius: "16px",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <CheckCircle2 size={18} />
                  Account Created Successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* NAME */}

            <div>
              <Label
                className="mb-2 block text-xs font-bold tracking-wider"
                style={{
                  color: theme.subText,
                }}
              >
                FULL NAME
              </Label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                />

                <Input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  onFocus={() =>
                    setFocusedField("name")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  className="h-14 rounded-2xl pl-12"
                  style={{
                    background: theme.input,
                    border:
                      focusedField === "name"
                        ? "1px solid rgba(99,102,241,0.6)"
                        : `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <Label
                className="mb-2 block text-xs font-bold tracking-wider"
                style={{
                  color: theme.subText,
                }}
              >
                EMAIL ADDRESS
              </Label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                />

                <Input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  onFocus={() =>
                    setFocusedField("email")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="h-14 rounded-2xl pl-12"
                  style={{
                    background: theme.input,
                    border:
                      email.length > 0
                        ? isValidEmail
                          ? "1px solid #22c55e"
                          : "1px solid #ef4444"
                        : `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                />
              </div>

              {email && (
                <p
                  className="mt-2 text-xs"
                  style={{
                    color: isValidEmail
                      ? "#22c55e"
                      : "#ef4444",
                  }}
                >
                  {isValidEmail
                    ? "✓ Valid Email Address"
                    : "✗ Invalid Email"}
                </p>
              )}
            </div>

            {/* PASSWORD */}

            <div>
              <Label
                className="mb-2 block text-xs font-bold tracking-wider"
                style={{
                  color: theme.subText,
                }}
              >
                PASSWORD
              </Label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                />

                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onFocus={() =>
                    setFocusedField("password")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                  onKeyUp={(e) =>
                    setCapsLock(
                      e.getModifierState(
                        "CapsLock"
                      )
                    )
                  }
                  placeholder="Create secure password"
                  disabled={isLoading}
                  className="h-14 rounded-2xl pl-12 pr-12"
                  style={{
                    background: theme.input,
                    border:
                      focusedField ===
                      "password"
                        ? "1px solid rgba(168,85,247,0.6)"
                        : `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {/* CAPS LOCK */}

              <AnimatePresence>
                {capsLock && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="flex items-center gap-2 mt-2"
                    style={{
                      color: "#f59e0b",
                      fontSize: "12px",
                    }}
                  >
                    <AlertTriangle size={14} />
                    Caps Lock is ON
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PASSWORD STRENGTH */}

              {password && (
                <div className="mt-4">

                  <div
                    style={{
                      width: "100%",
                      height: "6px",
                      borderRadius: "999px",
                      overflow: "hidden",
                      background:
                        "rgba(255,255,255,0.08)",
                    }}
                  >
                    <motion.div
                      animate={{
                        width: `${
                          passwordStrength * 25
                        }%`,
                      }}
                      style={{
                        height: "100%",
                        borderRadius:
                          "999px",

                        background:
                          passwordStrength <= 1
                            ? "#ef4444"
                            : passwordStrength <=
                              2
                            ? "#f59e0b"
                            : passwordStrength <=
                              3
                            ? "#22c55e"
                            : "#6366f1",
                      }}
                    />
                  </div>

                  <p
                    className="mt-2 text-xs"
                    style={{
                      color: theme.subText,
                    }}
                  >
                    Password Strength :
                    {" "}
                    {passwordStrength <= 1
                      ? "Weak"
                      : passwordStrength <=
                        2
                      ? "Medium"
                      : passwordStrength <=
                        3
                      ? "Strong"
                      : "Very Strong"}
                  </p>

                  {/* REQUIREMENTS */}

                  <div className="mt-4 space-y-2">

                    {[
                      {
                        ok: passwordChecks.length,
                        label:
                          "8+ Characters",
                      },
                      {
                        ok: passwordChecks.uppercase,
                        label:
                          "Uppercase Letter",
                      },
                      {
                        ok: passwordChecks.number,
                        label: "Number",
                      },
                      {
                        ok: passwordChecks.symbol,
                        label:
                          "Special Symbol",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs"
                        style={{
                          color: item.ok
                            ? "#22c55e"
                            : theme.subText,
                        }}
                      >
                        <CheckCircle2
                          size={14}
                        />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <Label
                className="mb-2 block text-xs font-bold tracking-wider"
                style={{
                  color: theme.subText,
                }}
              >
                CONFIRM PASSWORD
              </Label>

              <div className="relative">
                <ShieldCheck
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                />

                <Input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className="h-14 rounded-2xl pl-12 pr-12"
                  style={{
                    background: theme.input,
                    border:
                      password &&
                      confirmPassword
                        ? password ===
                          confirmPassword
                          ? "1px solid #22c55e"
                          : "1px solid #ef4444"
                        : `1px solid ${theme.border}`,
                    color: theme.text,
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {confirmPassword && (
                <p
                  className="mt-2 text-xs"
                  style={{
                    color:
                      password ===
                      confirmPassword
                        ? "#22c55e"
                        : "#ef4444",
                  }}
                >
                  {password ===
                  confirmPassword
                    ? "✓ Passwords Match"
                    : "✗ Passwords Do Not Match"}
                </p>
              )}
            </div>

            {/* BUTTON */}

            <motion.div
              whileHover={{
                scale: 1.01,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-white font-semibold text-[15px] shadow-2xl mt-2 border-0"
                style={{
                  background:
                    "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* SECURITY */}

            <div
              className="flex items-center justify-center gap-2 mt-5"
              style={{
                color: theme.subText,
                fontSize: "12px",
              }}
            >
              <ShieldCheck size={14} />
              Secure encrypted authentication
            </div>
          </form>

          {/* FOOTER */}

          <div className="mt-8">
            <p
              className="text-center text-sm"
              style={{
                color: theme.subText,
              }}
            >
              Already have an account?{" "}

              <button
                onClick={onNavigateToLogin}
                style={{
                  background:
                    "transparent",
                  border: "none",
                  color: "#818cf8",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
