"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function UserDropdown({ user, isOpen, onToggle, onLogout }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer"
      >
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
        <span className="font-medium">{user?.name || 'User'}</span>
        <ChevronDown size={16} />
      </button>

      {/* User Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50"
          >
            <div className="px-4 py-3 border-b">
              <div className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">{user?.email || 'user@example.com'}</div>
              <div className="flex items-center gap-2 mt-1">
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
            <hr />
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600 cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
