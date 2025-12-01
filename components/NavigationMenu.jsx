"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";

// Import separate components
import LoginModal from "./auth/LoginModal";
import UserDropdown from "./navigation/UserDropdown";
import MobileMenu from "./navigation/MobileMenu";
import DesktopMenu from "./navigation/DesktopMenu";
import { getMenuItems } from "./navigation/menuConfig";
import { useAuth } from "@/hooks/useAuth";

function NavigationBar() {
  const router = useRouter();
  const { isAuthenticated, user, authLoading, setUserData, logout } = useAuth();
  
  // UI state
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Ensure the component is hydrated
  useEffect(() => {
    setHydrated(true);
  }, []);

  const menuItems = getMenuItems(isAuthenticated);

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userData) => {
    setUserData(userData);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleNavigation = (link) => {
    router.push(link);
    setIsMobileMenuOpen(false);
    setOpenMenuIndex(null);
    setIsUserMenuOpen(false);
  };

  // Show loading state while checking auth
  if (!hydrated || authLoading) {
    return (
      <nav className="bg-white shadow p-4 flex items-center justify-between lg:px-32">
        <div className="text-lg font-bold">EMS</div>
        <div className="hidden lg:flex items-center gap-4">
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow p-4 flex items-center justify-between lg:px-32 fixed w-full z-50">
      <div 
        className="text-lg font-bold cursor-pointer" 
        onClick={() => handleNavigation('/')}
      >
        Orgatick
      </div>
      
      {/* Hamburger Menu for Mobile */}
      <button
        className="lg:hidden text-gray-700 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Menu */}
      <DesktopMenu
        menuItems={menuItems}
        openMenuIndex={openMenuIndex}
        setOpenMenuIndex={setOpenMenuIndex}
        onNavigation={handleNavigation}
      />

      {/* Auth Section - Desktop */}
      <div className="hidden lg:flex items-center gap-4">
        {isAuthenticated ? (
          <UserDropdown
            user={user}
            isOpen={isUserMenuOpen}
            onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
            onLogout={handleLogout}
          />
        ) : (
          <Button onClick={handleLogin} className="cursor-pointer">
            Login
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
        openMenuIndex={openMenuIndex}
        setOpenMenuIndex={setOpenMenuIndex}
        onNavigation={handleNavigation}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
}

export default NavigationBar;
