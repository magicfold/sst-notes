import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { Amplify } from "aws-amplify";
import config from "./config.ts";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.tsx";

// 设置我们要交互的各种 AWS 资源
Amplify.configure({
  Auth: {
    mandatorySignIn: true, // 强制登录（用户在与我们的应用程序交互之前必须登录）
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "notes", // 后端 API 的名称
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    ],
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
