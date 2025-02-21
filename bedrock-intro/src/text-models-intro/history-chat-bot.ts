import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

type HumanMessage = `User: ${string}`;
type BotMessage = `Bot: ${string}`;

const history: Array<HumanMessage|BotMessage> = [];


function getFormattedHistory(history: Array<HumanMessage|BotMessage>){
    return history.join('\n');
}

function getConfiguration(history: Array<HumanMessage|BotMessage>){
    return {
        inputText: getFormattedHistory(history),
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

    process.stdin.addListener('data', async (input) => {
        const userInput = input.toString().trim();
        history.push(`User: ${userInput}`);

        const response = await client.send(new InvokeModelCommand({
            body: JSON.stringify(getConfiguration(history)),
            modelId: 'amazon.titan-text-express-v1',
            contentType: 'application/json',
            accept: 'application/json',
        }))
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        const outputText = responseBody.results[0].outputText;

        console.log('Bot:', responseBody.results[0].outputText)

        // We dont need to prefix with Bot: because the  LLM will already assume that the response is from the bot
        history.push(outputText);
    })
}

main()