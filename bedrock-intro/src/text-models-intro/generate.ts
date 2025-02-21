import {
    BedrockRuntimeClient,
    InvokeModelCommand
} from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({region: 'us-east-1'});

// This configuration is specific to the Titan model
// each model has its own configuration and expects different parameters.
const titanConfig = {
    inputText: 'Tell me a story about a dragon',
    textGenerationConfig: {
        maxTokenCount: 4096,
        stopSequences: [],
        temperature: 0,
        topP: 1
    }
}

const titanModelIdentifier = 'amazon.titan-text-express-v1';

const llamaConfig = {
    prompt: "Tell me a story about a dragon",
    max_gen_len: 512,
    temperature: 0,
    top_p: 1
}

const llamaModelIdentifier = 'meta.llama3-70b-instruct-v1:0';

async function main() {
    const titanResponse = await invokeModel(titanConfig, titanModelIdentifier);
    const llamaResponse = await invokeModel(llamaConfig, llamaModelIdentifier);

    console.log('Titan Model Resp:\n', titanResponse.results[0].outputText);
    console.log('Llama Model Resp:\n', llamaResponse.generation);
}

async function  invokeModel(modelConfig: any, modelId: any) {
    const response = await client.send(
        new InvokeModelCommand({
            body: JSON.stringify(modelConfig),
            modelId: modelId,
            contentType: "application/json",
            accept: "application/json"
        })
    )

    const responseBody = await JSON.parse(new TextDecoder().decode(response.body));

    return responseBody;
}

main();