import * as uuid from "uuid";
import { Resource } from "sst";
import { Util } from "@sst-notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(
  // Lambda 函数 async，并简单地返回结果
  async (event) => {
    let data = {
      content: "",
      attachment: "",
    };

    // 解析来自 event.body 的输入。这代表 HTTP request body。
    if (event.body != null) {
      data = JSON.parse(event.body);
    }

    const params = {
      TableName: Resource.Notes.name, // 通过 Resource.Notes.name 使用 SST SDK 访问我们关联的 DynamoDB 表
      Item: {
        // The attributes of the item to be created
        userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId, // The id of the author
        noteId: uuid.v1(), // A unique uuid
        content: data.content, // Parsed from request body
        attachment: data.attachment, // Parsed from request body (如果存在的话。它是将上传到我们 S3 存储桶的文件的文件名。)
        createdAt: Date.now(), // Current Unix timestamp
      },
    };

    await dynamoDb.send(new PutCommand(params));

    return JSON.stringify(params.Item);
  }
);
