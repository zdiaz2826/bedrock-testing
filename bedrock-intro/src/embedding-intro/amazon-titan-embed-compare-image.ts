import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { readFileSync } from 'fs'
import { cosineSimilarity } from './similarity';

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

// type for an image with its embedding
type ImageWithEmbedding = {
    path: string
    embedding: number[]
}

// our list of images
const images = [
    'images/1.png',
    'images/2.png',
    'images/3.png',
]

async function main(){
    const imagesWithEmbeddings: ImageWithEmbedding[] = []

    // Get the embeddings for all images
    for (const imagePath of images) {
        const embedding = await getImageEmbedding(imagePath)
        imagesWithEmbeddings.push({path: imagePath, embedding})
    }

    // the image we want to compare agaoinst the others
    const testImage = 'images/cat.png'

    // We get the embedding for the test image as well
    const testImageEmbedding = await getImageEmbedding(testImage)

    // initialize an array to store the similarities
    const similarities: {
        path: string,
        similarity: number
    }[] = [];

    // Calculate the cosine similarity between the test image and all the other images
    for (const imageWithEmbedding of imagesWithEmbeddings) {
        const similarity = cosineSimilarity(imageWithEmbedding.embedding, testImageEmbedding)
        similarities.push({path: imageWithEmbedding.path, similarity})
    }

    // Sort the similarities in descending order, the higher the similarity the more similar the images are
    const sortedSimilarities = similarities.sort((a, b) => b.similarity - a.similarity);

    console.log(`Similarity of ${testImage} with:`)
    sortedSimilarities.forEach(similarity => {
        console.log(`${similarity.path}: ${similarity.similarity.toPrecision(2)}`);
    })
}

async function getImageEmbedding(imagePath: string): Promise<number[]> {
    const base64Image = readFileSync(imagePath).toString('base64');

    // Use an embedding model to get the embedding of the image
    // remember the embedding is a vector representation of the image
    const response = await client.send(new InvokeModelCommand({
        body: JSON.stringify({
            "inputImage": base64Image
        }),
        modelId: 'amazon.titan-embed-image-v1',
        accept: 'application/json',
        contentType: 'application/json',
    }))

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    return responseBody.embedding
}

main();