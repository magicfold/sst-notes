import { table, secret } from "./storage";

// Create the API
export const api = new sst.aws.ApiGatewayV2("Api", {
  // 通过使用 transform 属性，告诉 API 希望将给定的属性应用到 API 中的所有路由
  transform: {
    route: {
      handler: {
        link: [table, secret], // 连接 DynamoDB 表和 Secret
      },
      args: {
        auth: { iam: true }, // 使用 IAM 身份验证
      },
    },
  },
});

api.route("POST /notes", "packages/functions/src/create.main");
api.route("GET /notes/{id}", "packages/functions/src/get.main");
api.route("GET /notes", "packages/functions/src/list.main");
api.route("PUT /notes/{id}", "packages/functions/src/update.main");
api.route("DELETE /notes/{id}", "packages/functions/src/delete.main");
