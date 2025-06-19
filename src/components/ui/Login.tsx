"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLogin } from "@/context/login-context";

interface LoginData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const router = useRouter();
  const { login, checkAuthStatus } = useLogin();

  // Check if user is already authenticated
  useEffect(() => {
    if (checkAuthStatus()) {
      router.push("/dashboard");
    }
  }, [router, checkAuthStatus]);

  // Handle login attempt blocking (security feature)
  useEffect(() => {
    const attempts = localStorage.getItem("login_attempts");
    const lastAttempt = localStorage.getItem("last_attempt_time");

    if (attempts && lastAttempt) {
      const attemptCount = Number.parseInt(attempts);
      const lastAttemptTime = Number.parseInt(lastAttempt);
      const timeDiff = Date.now() - lastAttemptTime;
      const blockDuration = 15 * 60 * 1000; // 15 minutes

      if (attemptCount >= 3 && timeDiff < blockDuration) {
        setIsBlocked(true);
        setLoginAttempts(attemptCount);
        setBlockTimeRemaining(Math.ceil((blockDuration - timeDiff) / 1000));

        const interval = setInterval(() => {
          setBlockTimeRemaining((prev) => {
            if (prev <= 1) {
              setIsBlocked(false);
              setLoginAttempts(0);
              localStorage.removeItem("login_attempts");
              localStorage.removeItem("last_attempt_time");
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      } else if (timeDiff >= blockDuration) {
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("last_attempt_time");
        setLoginAttempts(0);
      } else {
        setLoginAttempts(attemptCount);
      }
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem("login_attempts", newAttempts.toString());
    localStorage.setItem("last_attempt_time", Date.now().toString());

    if (newAttempts >= 3) {
      setIsBlocked(true);
      setBlockTimeRemaining(15 * 60); // 15 minutes in seconds

      const interval = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            localStorage.removeItem("login_attempts");
            localStorage.removeItem("last_attempt_time");
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      setErrors({
        general: `Account temporarily blocked. Try again in ${Math.ceil(
          blockTimeRemaining / 60
        )} minutes.`,
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call - Replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login - Replace with actual API response
      const mockResponse = {
        success: true,
        tokens: {
          access: "mock_jwt_token_" + Date.now(),
        },
        user_name: formData.email, // Use email as username
      };

      if (mockResponse.success) {
        // Clear login attempts on successful login
        localStorage.removeItem("login_attempts");
        localStorage.removeItem("last_attempt_time");
        setLoginAttempts(0);

        // Use the login context
        login({
          token: mockResponse.tokens.access,
          userName: mockResponse.user_name,
        });

        router.push("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      handleFailedLogin();
      setErrors({
        general: "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="absolute top-0 left-0 min-h-screen w-screen bg-gradient-to-br from-[#002c58] to-gray-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-[#002c58]">
            हरिपुर नगरपालिका
          </CardTitle>
          <p className="text-gray-600 text-sm mt-1">Government Portal Login</p>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={onFinish} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                disabled={isBlocked}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  disabled={isBlocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isBlocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {errors.general && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            {isBlocked && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Too many failed attempts. Try again in{" "}
                  {formatTime(blockTimeRemaining)}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-[#002c58] hover:bg-[#003d73]"
              disabled={loading || isBlocked}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Secure Government Portal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
