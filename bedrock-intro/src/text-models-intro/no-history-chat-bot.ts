import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

function getConfiguration(prompt: string){
    return {
        inputText: prompt,
        textGenerationConfig : {
            maxTokenCount: 4096,
            stopSequences: [],
            temperature: 0,
            topP: 1,
        },
    };
}

async function main() {
    console.log('Bot:\nType a message to start the conversation.')

    console.log('User:')
    process.stdin.addListener('data', async (input) => {
        const userInput = `User: ${input.toString().trim()}`;

        const response = await client.send(new InvokeModelCommand({
            body: JSON.stringify(getConfiguration(userInput)),
            modelId: 'amazon.titan-text-express-v1',
            contentType: 'application/json',
            accept: 'application/json',
        }))
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));

        console.log('Bot:', responseBody.results[0].outputText)
    })
}

main()