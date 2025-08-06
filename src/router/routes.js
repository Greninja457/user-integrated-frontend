// src/router/routes.js
export default [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/HomePage.vue"),
      },

      {
        path: "/jobs",
        name: "JobsDashboard",
        component: () => import("src/pages/Jobs/JobDashboard.vue"),
      },

      {
        path: "/jobs/:id",
        name: "JobApply",
        component: () => import("src/pages/Jobs/JobApply.vue"),
        props: true,
      },

      {
        path: "register",
        component: () => import("src/pages/RegisterPage.vue"),
      },
      {
        path: "login",
        component: () => import("src/pages/LoginPage.vue"),
      },
      {
        path: "userdashboard",
        component: () => import("pages/UserDashboard.vue"),
        children: [
          {
            path: "",
            component: () =>
              import("src/components/UserDashboard/RecommJobs.vue/Jobs.vue"),
          },
          {
            path: "profile",
            component: () =>
              import("src/components/UserDashboard/Profile/Profile.vue"),
          },
        ],
      },
      {
        path: "recruiterdashboard",
        component: () => import("src/pages/RecruiterDashboard.vue"),
        children: [
          {
            path: "",
            component: () =>
              import("src/components/RecruiterDashboard/Profile.vue"),
          },
          {
            path: "profile",
            component: () =>
              import("src/components/RecruiterDashboard/Profile.vue"),
          },
          {
            path: "feature2",
            component: () =>
              import("src/components/RecruiterDashboard/Feature1/Feature1.vue"),
          },
        ],
      },
    ],
  },
];
