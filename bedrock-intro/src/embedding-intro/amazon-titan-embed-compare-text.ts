import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

const fact = "The first moon landing was in 1969."
const animal = "cat"


// Different embedding models have output of different dimensions (Vector size)
async function compareEmbeddings() {
    // Titan Text Embeddings V2
    const responseV1 = await client.send(new InvokeModelCommand({
        body: JSON.stringify({ inputText: fact }),
        modelId: 'amazon.titan-embed-text-v2:0',
        contentType: 'application/json',
        accept: 'application/json',
    }))

    // Titan Embeddings G1 - Text
    const responseG1 = await client.send(new InvokeModelCommand({
        body: JSON.stringify({ inputText: animal }),
        modelId: 'amazon.titan-embed-text-v1',
        contentType: 'application/json',
        accept: 'application/json',
    }))

    const embeddingV1 = JSON.parse(new TextDecoder().decode(responseV1.body)).embedding;
    const embeddingG1 = JSON.parse(new TextDecoder().decode(responseG1.body)).embedding;

    console.log('Titan V1 embedding dimensions:', embeddingV1.length);  // 1536
    console.log('Titan G1 embedding dimensions:', embeddingG1.length);  // 4096
}

compareEmbeddings();
