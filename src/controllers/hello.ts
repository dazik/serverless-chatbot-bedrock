import { APIGatewayEvent } from "aws-lambda";
import {
    BedrockRuntimeClient,
    InvokeModelCommand,
  } from "@aws-sdk/client-bedrock-runtime";
import { BedrockAgentRuntimeClient, RetrieveCommand, RetrieveCommandInput } from "@aws-sdk/client-bedrock-agent-runtime";
import { config } from '../config/config'

const defaultHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
}

type Message = {
    text: string
}

const bedrockRuntimeClient = new BedrockRuntimeClient({ region: config.deployment.region });
const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient({ region: config.deployment.region });

export const handler = async (event: APIGatewayEvent) => {
    console.log("Received " + JSON.stringify(event));
    const body: Message = JSON.parse(event.body as string);
    // const retrieveParams: RetrieveCommandInput = {
    //     knowledgeBaseId: "WTXMY8MXLZ",
    //     retrievalQuery: {
    //         text: body.text || ""
    //     },
    //     retrievalConfiguration: {
    //       vectorSearchConfiguration: {
    //         numberOfResults: 3,
    //       },
    //     },
    //   };
  
    //   const retrieveCommand = new RetrieveCommand(retrieveParams);
    //   const retrieveResponse = await bedrockAgentRuntimeClient.send(
    //     retrieveCommand
    //   );

    //   if (!retrieveResponse) {
    //     return {
    //         status: 500,
    //         headers: defaultHeaders,
    //         body: JSON.stringify({
    //             message: "Error retrieving information from knowledge base"
    //         })
    //     }
    //   }

    //   console.log(retrieveResponse);

    //   if (!retrieveResponse.retrievalResults ||retrieveResponse.retrievalResults.length === 0) {
    //     return {
    //         status: 404,
    //         headers: defaultHeaders,
    //         body: JSON.stringify({
    //             message: "No information found in knowledge base"
    //         })
    //     }
    //   }
  
    //   const retrievedInfo = retrieveResponse.retrievalResults
    //     .map((result) => result.content?.text)
    //     .join("\n\n");
    //   const prompt = `Given the following information from the knowledge base:
    //           ${retrievedInfo}
              
    //           Now, answer this question: ${body.text}`;

    const prompt = `Act as a friendly assistant and help me to get any information or answer given question: ${body.text}`
  
      // Then, use Claude to generate a response based on the retrieved information
      const inputData = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      };
  
      const invokeParams = {
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(inputData),
      };
  
      const invokeCommand = new InvokeModelCommand(invokeParams);
      const invokeResponse = await bedrockRuntimeClient.send(invokeCommand);
  
      const responseBody = JSON.parse(
        new TextDecoder().decode(invokeResponse.body)
      );
  
      console.log(responseBody);
      const result = responseBody.content[0].text;
    return {
        statusCode: 200,
        headers: defaultHeaders,
        body: JSON.stringify({
            message: result
        })
    }
}