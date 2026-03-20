import { api } from "./api";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

// 创建 Cognito 用户池
export const userPool = new sst.aws.CognitoUserPool("UserPool", {
  usernames: ["email"], // 用户用 email 登录
});

// 为用户池创建一个客户端
export const userPoolClient = userPool.addClient("UserPoolClient");

// 创建一个身份池
export const identityPool = new sst.aws.CognitoIdentityPool("IdentityPool", {
  userPools: [
    {
      userPool: userPool.id,
      client: userPoolClient.id,
    },
  ],
  // 指定经过验证的用户可以访问的资源: 1. S3 存储桶，2. API
  permissions: {
    authenticated: [
      // 授予已登录用户对 S3 存储桶 ARN 中的路径 private/${cognito-identity.amazonaws.com:sub}/ 的访问权限
      {
        actions: ["s3:*"],
        resources: [
          $concat(
            bucket.arn,
            "/private/${cognito-identity.amazonaws.com:sub}/*" // 经过身份验证的用户的联合身份 ID（他们的用户 ID）
          ),
        ],
      },
      // 允许经过验证的用户访问 API
      {
        actions: ["execute-api:*"],
        resources: [
          $concat(
            "arn:aws:execute-api:",
            region,
            ":",
            aws.getCallerIdentityOutput({}).accountId,
            ":",
            api.nodes.api.id,
            "/*/*/*"
          ),
        ],
      },
    ],
  },
});
