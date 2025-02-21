import {
    BedrockClient,
    ListFoundationModelsCommand,
    GetFoundationModelCommand

} from '@aws-sdk/client-bedrock';

// it is best practice to create a client once and reuse it
const client = new BedrockClient({region: 'us-east-1'});

// Use this method to list the models available in the account
async function listFoundationModels() {

    const response = await client.send(
        new ListFoundationModelsCommand({})
    )

    console.log(response)
}

// Use this method to get information about a specific model
async function getModelInfo(modelName: string) {

    const response = await client.send(
        new GetFoundationModelCommand({
            modelIdentifier: modelName
        })
    )

    console.log(response)
}

listFoundationModels();
// getModelInfo('mistral.mistral-small-2402-v1:0');