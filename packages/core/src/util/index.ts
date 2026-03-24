import { Context, APIGatewayProxyEvent } from "aws-lambda";

//

export module Util {
  /* handler 是 Lambda 函数的包装器
   *
   * 我们希望集中处理所有 Lambda 函数中的错误。
   * 最后，由于我们所有的 Lambda 函数都将处理 API 端点，我们希望在一个地方统一处理 HTTP 响应。
   */
  export function handler(
    lambda: (evt: APIGatewayProxyEvent, context: Context) => Promise<string>
  ) {
    return async function (event: APIGatewayProxyEvent, context: Context) {
      let body: string, statusCode: number;

      try {
        // Run the Lambda
        body = await lambda(event, context);
        statusCode = 200;
      } catch (error) {
        statusCode = 500;
        body = JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        });
      }

      // Return HTTP response
      return {
        body,
        statusCode,
        // CORS
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      };
    };
  }
}
