import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  Eye,
  EyeOff,
  LoorgotPassword,
}: LoginPageProps) {
  const { login } = useAuth();
ssword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [darkMode, setDarkMode] = useState(true);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const [capsLock, setCapsLock] = useState(false);

  const [success, setSuccess] = useState(false);

  // =========================
  // EMAIL VALIDATION
  // =========================

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

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
  // LOGIN
  // =========================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!isValidEmail) {
      setError("Please enter valid email");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      login();

      setSuccess(true);

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 1400);
    }, 1200);
  };

  // =========================
  // THEME
  // =========================

  const theme = darkMode
    ? {
        background:
          "linear-gradient(135deg,#050816 0%,#0f172a 35%,#111827 65%,#1e1b4b 100%)",

        card: "rgba(10,15,35,0.75)",

        text: "#ffffff",

        subText: "rgba(203,213,225,0.75)",

        input: "rgba(255,255,255,0.05)",

        border: "rgba(255,255,255,0.08)",
      }
    : {
        background:
          "linear-gradient(135deg,#eef2ff 0%,#f8fafc 40%,#ede9fe 70%,#fdf2f8 100%)",

        card: "rgba(255,255,255,0.75)",

        text: "#111827",

        subText: "rgba(71,85,105,0.9)",

        input: "rgba(255,255,255,0.7)",

        border: "rgba(15,23,42,0.08)",
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
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.button>

      {/* ================= MAIN CARD ================= */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
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
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.2)",
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
              Welcome Back
            </h1>

            <p
              style={{
                color: theme.subText,
              }}
              className="text-sm leading-7"
            >
              Login to continue building beautiful resumes and
              portfolios.
            </p>
          </div>

          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit}>
            {/* ERROR */}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5"
                  style={{
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)",
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-5"
                  style={{
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.3)",
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
                  Login Successful! Redirecting...
                </motion.div>
              )}
            </AnimatePresence>

            {/* EMAIL */}

            <div className="mb-5">
              <label
                style={{
                  color: theme.subText,
                }}
                className="
                  block
                  mb-2
                  text-xs
                  font-bold
                  tracking-wider
                "
              >
                EMAIL ADDRESS
              </label>

              <motion.div
                animate={
                  focusedField === "email"
                    ? { scale: 1.02 }
                    : { scale: 1 }
                }
                className="relative"
              >
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      focusedField === "email"
                        ? "#818cf8"
                        : "#94a3b8",
                  }}
                >
                  <Mail size={18} />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="w-full"
                  style={{
                    height: "58px",
                    borderRadius: "18px",
                    paddingLeft: "48px",
                    paddingRight: "16px",
                    background: theme.input,
                    color: theme.text,
                    outline: "none",
                    fontSize: "14px",

                    border:
                      email.length > 0
                        ? isValidEmail
                          ? "1px solid #22c55e"
                          : "1px solid #ef4444"
                        : `1px solid ${theme.border}`,
                  }}
                />
              </motion.div>

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

            <div className="mb-4">
              <label
                style={{
                  color: theme.subText,
                }}
                className="
                  block
                  mb-2
                  text-xs
                  font-bold
                  tracking-wider
                "
              >
                PASSWORD
              </label>

              <div className="relative">
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      focusedField === "password"
                        ? "#a78bfa"
                        : "#94a3b8",
                  }}
                >
                  <Lock size={18} />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  onKeyUp={(e) =>
                    setCapsLock(e.getModifierState("CapsLock"))
                  }
                  placeholder="Enter password"
                  disabled={isLoading}
                  className="w-full"
                  style={{
                    height: "58px",
                    borderRadius: "18px",
                    paddingLeft: "48px",
                    paddingRight: "52px",
                    background: theme.input,
                    border:
                      focusedField === "password"
                        ? "1px solid rgba(168,85,247,0.6)"
                        : `1px solid ${theme.border}`,
                    color: theme.text,
                    outline: "none",
                    fontSize: "14px",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{
                    color: "#94a3b8",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                      background: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <motion.div
                      animate={{
                        width: `${passwordStrength * 25}%`,
                      }}
                      style={{
                        height: "100%",
                        borderRadius: "999px",
                        background:
                          passwordStrength <= 1
                            ? "#ef4444"
                            : passwordStrength <= 2
                            ? "#f59e0b"
                            : passwordStrength <= 3
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
                      : passwordStrength <= 2
                      ? "Medium"
                      : passwordStrength <= 3
                      ? "Strong"
                      : "Very Strong"}
                  </p>

                  {/* REQUIREMENTS */}

                  <div className="mt-4 space-y-2">
                    {[
                      {
                        ok: passwordChecks.length,
                        label: "8+ Characters",
                      },
                      {
                        ok: passwordChecks.uppercase,
                        label: "Uppercase Letter",
                      },
                      {
                        ok: passwordChecks.number,
                        label: "Number",
                      },
                      {
                        ok: passwordChecks.symbol,
                        label: "Special Symbol",
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
                        <CheckCircle2 size={14} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* REMEMBER */}

            <div className="flex items-center justify-between flex-wrap gap-3 mt-5 mb-7">
              <label
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    background: rememberMe
                      ? "#6366f1"
                      : "transparent",
                    border: rememberMe
                      ? "2px solid #6366f1"
                      : `2px solid ${theme.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {rememberMe && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      ✓
                    </motion.span>
                  )}
                </div>

                <span
                  style={{
                    color: theme.subText,
                  }}
                  className="text-sm"
                >
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                style={{
                  color: "#818cf8",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                className="text-sm"
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              style={{
                width: "100%",
                height: "60px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)",
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow:
                  "0 15px 35px rgba(99,102,241,0.35)",
              }}
            >
              {!isLoading && (
                <motion.div
                  animate={{
                    x: ["-120%", "200%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)",
                    transform: "skewX(-20deg)",
                  }}
                />
              )}

              {isLoading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

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
              Don&apos;t have an account?{" "}

              <button
                onClick={onNavigateToSignup}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#818cf8",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create account
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
