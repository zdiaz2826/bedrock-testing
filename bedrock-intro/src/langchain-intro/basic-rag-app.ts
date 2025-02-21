import { BedrockEmbeddings } from "@langchain/aws";
import { Bedrock } from "@langchain/community/llms/bedrock";
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { Document } from '@langchain/core/documents'
import { ChatPromptTemplate } from '@langchain/core/prompts';

const AWS_REGION = 'us-east-1';

const model = new Bedrock({
    model: 'amazon.titan-text-express-v1',
    region: AWS_REGION
})

const myData = [
    "The weather is nice today.",
    "Last night's game ended in a tie.",
    "Don likes to eat pizza.",
    "Don likes to eat pasta.",
];

const question = "What are Don's favorite foods?";

async function main() {
    // create a memory vector store
    // we dont specify a embedding model because langchain will use the default
    // which is the amazon titan embedding model
    const vectorStore = new MemoryVectorStore(
        new BedrockEmbeddings({
            region: AWS_REGION,
        })
    );

    // Now add the additional knowledge to the vector store
    // using langchain's Document class
    await vectorStore.addDocuments(myData.map(
        content => new Document({
            pageContent: content
        })
    ))

    // Now we can use the vector store to retrieve the most similar documents
    // this is like the connection to your database
    const retriever = vectorStore.asRetriever({
        // the number of similar documents to return
        // Remember most vector databases use the (k-NN) algorithm "nearest neighbors"
        k: 2
    });

    // Now we can use the retriever to invoke our model
    // this is like the query to your database
    const results = await retriever.invoke(question);

    // Now we can use the results to build our response
    const resultList = results.map(
        result => result.pageContent
    )

    // This is our prompt template
    const template = ChatPromptTemplate.fromMessages([
        ['system', 'Answer the users question based on the following context: {context}'],
        ['user', '{input}']
    ]);

    const chain = template.pipe(model);

    const response = await chain.invoke({
        input: question,
        context: resultList
    })

    console.log(response)

}

main()
