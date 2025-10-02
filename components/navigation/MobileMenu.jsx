"use client";

import { ChevronDown, X } from "lucide-react";
import * as Icons from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  menuItems, 
  openMenuIndex, 
  setOpenMenuIndex, 
  onNavigation, 
  isAuthenticated, 
  user, 
  onLogin, 
  onLogout 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 w-full h-screen bg-white z-50 p-4 lg:hidden"
        >
          <button
            className="absolute top-4 right-4 text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <X size={24} />
          </button>
          <ul className="space-y-4 mt-8">
            {menuItems.map((item, index) => (
              <li key={index} className="relative">
                {item.submenu ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full text-gray-700 font-medium focus:outline-none"
                      onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
                    >
                      {item.title}
                      <ChevronDown size={16} />
                    </button>
                    {openMenuIndex === index && (
                      <ul className="mt-2 space-y-2 pl-4">
                        {item.submenu.map((subItem, subIndex) => {
                          const Icon = Icons[subItem.icon] || Icons.Circle;
                          return (
                            <li key={subIndex}>
                              <button
                                onClick={() => onNavigation(subItem.link)}
                                className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer"
                              >
                                <Icon size={16} />
                                {subItem.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <button 
                    onClick={() => onNavigation(item.link)}
                    className="text-gray-700 hover:text-black font-medium cursor-pointer"
                  >
                    {item.title}
                  </button>
                )}
              </li>
            ))}
            
            {/* Mobile Auth Section */}
            <li className="border-t pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-800">{user?.name || 'User'}</div>
                      <div className="text-sm text-gray-500">{user?.email || 'user@example.com'}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {user?.isVerified && (
                          <Badge variant="default" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        {user?.orgRole && (
                          <Badge variant="outline" className="text-xs">
                            {user.orgRole}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer w-full text-left px-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Button 
                  onClick={onLogin} 
                  className="w-full cursor-pointer"
                >
                  Login
                </Button>
              )}
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
