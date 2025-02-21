import { BedrockChat } from '@langchain/community/chat_models/bedrock';
import { ChatPromptTemplate } from '@langchain/core/prompts'

const AWS_REGION = 'us-east-1';

const model = new BedrockChat({
    model: 'amazon.titan-text-express-v1',
    region: AWS_REGION
});

async function invokeModel() {
    const response = await model.invoke("What is the highest mountain in the world?");

    console.log(response.content);
}

async function firstChain() {
    const prompt = ChatPromptTemplate.fromMessages([
        ['system', 'Write a short description for the product provided by the user'],
        ['human', '{product_name}']
    ])

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
        product_name: 'bicycle'
    })
    console.log(response.content)
}

// invokeModel()
firstChain()

