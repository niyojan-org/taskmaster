import { title } from "process";

// Menu configuration for navigation
export const getMenuItems = (isAuthenticated) => [
  {
    title: "Home",
    link: "/",
  },
  ...(isAuthenticated ? [
    {
      title: "Organizations",
      submenu: [
        {
          title: "Organization List",
          subtext: "View and manage all organizations",
          link: "/org/manage",
          icon: "Building2",
        },
        {
          title: "Organization Details",
          subtext: "View specific organization",
          link: "/org",
          icon: "Building",
        },
        {
          title: "Verify Organization",
          subtext: "Verify organization documents",
          link: "/org/verify-org",
          icon: "Shield",
        },
      ],
    },
    {
      title: "Event",
      submenu: [
        {
          title: "Manage Events",
          subtext: "View and manage all events",
          link: "/event/manage",
          icon: "CalendarCheck",
        },
        {
          title: "Event Analytics",
          subtext: "View event analytics and reports",
          link: "/event",
          icon: "BarChart2",
        }
      ],
    },
    {
      title: "Resources",
      submenu: [
        {
          title: "Create Resource",
          subtext: "Create a new resource",
          link: "/resource/create",
          icon: "FilePlus",
        },
        {
          title: "Manage Resource",
          subtext: "Manage existing resources",
          link: "/resource/manage",
          icon: "FileText",
        },
      ],
    },
  ] : []),
  {
    title: "Documentation",
    link: "/docs",
  },
];
