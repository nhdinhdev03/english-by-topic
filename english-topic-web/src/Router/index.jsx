import { lazy } from "react";

// Lazy load các page components để tối ưu performance
const Home = lazy(() => import("../Pages/Home"));
const Learn = lazy(() => import("../Pages/Learn"));
const Quiz = lazy(() => import("../Pages/Quiz"));
const Review = lazy(() => import("../Pages/Review"));
const Topics = lazy(() => import("../Pages/Topics"));
const TopicLearn = lazy(() => import("../Pages/TopicLearn"));
const Progress = lazy(() => import("../Pages/Progress"));
const About = lazy(() => import("../Pages/About"));
const Settings = lazy(() => import("../Pages/Settings"));
const GrammarQuiz = lazy(() => import("../Pages/GrammarQuiz"));

export const publicRoutes = [
  {
    path: "/",
    element: Home,
    name: "Trang chủ",
  },
  {
    path: "/learn",
    element: Learn,
    name: "Học từ mới",
  },
  {
    path: "/quiz",
    element: Quiz,
    name: "Trắc nghiệm",
  },
  {
    path: "/grammar-quiz",
    element: GrammarQuiz,
    name: "Grammar Top Notch 2",
  },
  {
    path: "/review",
    element: Review,
    name: "Ôn tập",
  },
  {
    path: "/topics",
    element: Topics,
    name: "Chủ đề",
  },
  {
    path: "/progress",
    element: Progress,
    name: "Tiến độ",
  },
  {
    path: "/about",
    element: About,
    name: "Giới thiệu",
  },
];

// Hidden routes - không hiển thị trong navigation menu
export const hiddenRoutes = [
  {
    path: "/settings",
    element: Settings,
    name: "Cài đặt",
  },
  {
    path: "/learn/:topicName",
    element: TopicLearn,
    name: "Học theo chủ đề",
  },
];

// Combine all routes for App.jsx
export const allRoutes = [...publicRoutes, ...hiddenRoutes];

export const privateRoutes = [
  // Có thể thêm các routes dành riêng cho admin sau này
];
