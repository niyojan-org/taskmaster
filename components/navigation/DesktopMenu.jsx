"use client";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronDown } from "@tabler/icons-react";
import * as TablerIcons from "@tabler/icons-react";

export default function DesktopMenu({ 
  menuItems, 
  openMenuIndex, 
  setOpenMenuIndex, 
  onNavigation 
}) {
  return (
    <ul className="hidden lg:flex space-x-8">
      {menuItems.map((item, index) => (
        <li
          key={index}
          className="relative group"
          onMouseEnter={() => setOpenMenuIndex(index)}
          onMouseLeave={() => setOpenMenuIndex(null)}
        >
          {item.submenu ? (
            <>
              <button className="flex items-center gap-1 text-gray-700 hover:text-black font-medium focus:outline-none">
                {item.title}
                <IconChevronDown size={16} />
              </button>

              {/* Framer Motion Dropdown */}
              <AnimatePresence>
                {openMenuIndex === index && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-64 bg-white border rounded shadow z-50"
                  >
                    {item.submenu.map((subItem, subIndex) => {
                      const Icon = TablerIcons[`Icon${subItem.icon}`] || TablerIcons.IconCircle;
                      return (
                        <li key={subIndex} className="border-b last:border-none">
                          <button
                            onClick={() => onNavigation(subItem.link)}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 w-full text-left cursor-pointer"
                          >
                            <Icon size={20} className="text-gray-500 mt-1" />
                            <div>
                              <div className="text-sm font-semibold text-gray-800">
                                {subItem.title}
                              </div>
                              <div className="text-xs text-gray-500">{subItem.subtext}</div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
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
    </ul>
  );
}
