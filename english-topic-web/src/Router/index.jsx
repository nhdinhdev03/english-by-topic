import { lazy } from "react";

// Lazy load các page components để tối ưu performance
const Home = lazy(() => import("../Pages/Home"));
const Learn = lazy(() => import("../Pages/Learn"));
const Quiz = lazy(() => import("../Pages/Quiz"));
const Review = lazy(() => import("../Pages/Review"));
const Topics = lazy(() => import("../Pages/Topics"));
const Settings = lazy(() => import("../Pages/Settings"));
const Progress = lazy(() => import("../Pages/Progress"));
const About = lazy(() => import("../Pages/About"));

export const publicRoutes = [
  {
    path: "/",
    element: Home,
    name: "Trang chủ"
  },
  {
    path: "/learn",
    element: Learn,
    name: "Học từ mới"
  },
  {
    path: "/quiz",
    element: Quiz,
    name: "Trắc nghiệm"
  },
  {
    path: "/review",
    element: Review,
    name: "Ôn tập"
  },
  {
    path: "/topics",
    element: Topics,
    name: "Chủ đề"
  },
  {
    path: "/progress",
    element: Progress,
    name: "Tiến độ"
  },
  {
    path: "/settings",
    element: Settings,
    name: "Cài đặt"
  },
  {
    path: "/about",
    element: About,
    name: "Giới thiệu"
  }
];

export const privateRoutes = [
  // Có thể thêm các routes dành riêng cho admin sau này
];
