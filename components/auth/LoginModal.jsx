"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", credentials);
      localStorage.setItem("token", response.data.data.token);
      toast.success(response.data.message || "Login successful!");
      
      // Fetch user data after successful login
      const userResponse = await api.get('/user/me');
      if (userResponse.data.status === 'success') {
        onLoginSuccess(userResponse.data.data.user);
      }
      
      setCredentials({ email: "", password: "" });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setCredentials({ email: "", password: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-blue-50/80 via-white/60 to-indigo-50/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-md">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X size={20} />
              </button>

              <CardHeader className="text-center pb-6 pt-8">
                {/* Logo/Icon */}
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">EMS</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</CardTitle>
                <p className="text-gray-600 text-sm">Sign in to access your EMS dashboard</p>
              </CardHeader>

              <CardContent className="space-y-6 pb-8">
                {/* Email Input */}
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={handleChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      className="pl-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={handleChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                      className="pl-11 pr-11 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !credentials.email || !credentials.password} 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Cancel Button */}
                <Button 
                  onClick={handleClose} 
                  variant="outline" 
                  className="w-full h-12 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
