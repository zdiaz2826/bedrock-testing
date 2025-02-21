import { BedrockEmbeddings } from "@langchain/aws";
import { Bedrock } from "@langchain/community/llms/bedrock";
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

const AWS_REGION = 'us-east-1';

const model = new Bedrock({
    model: 'amazon.titan-text-express-v1',
    region: AWS_REGION
})

const question = "What themes does Gone with the Wind explore?";

async function main() {

    // We set split to false because we will split the document ourselves
    const loader = new PDFLoader('assets/books.pdf', {
        splitPages: false
    });

   // this will load the pages into one document
    const docs = await loader.load();

    // split the docs
    // This is what is considered chunking when working with RAG
    // You can split or chunk the document in any way you want using a custom splitter
    // or you can tell the spliter to chunk based on size or character count
    const splitter = new RecursiveCharacterTextSplitter({
        separators: [`. \n`]
    });

    const splittedDocs = await splitter.splitDocuments(docs);

    // store the documents in our memory vector store
    const vectorStore = new MemoryVectorStore(
        new BedrockEmbeddings({
            region: AWS_REGION
        })
    );

    // add our splitted docs to the vector store
    await vectorStore.addDocuments(splittedDocs);

    // retrieve the most relevant documents based on the question
    const retriever = vectorStore.asRetriever({
        k: 2
    });

    // The query text is converted to an embedding vector internally
    // This vector is compared against stored document vectors using similarity search
    // The most relevant documents are returned based on similarity scores
    // getRelevantDocuments is an older way of invoking the retriever invoke() is now used instead
    // const results = await retriever.getRelevantDocuments(question);
    const results = await retriever.invoke(question);

    const resultDocs = results.map(
        result => result.pageContent
    )

    //build template:
    const template = ChatPromptTemplate.fromMessages([
        ['system', 'Answer the users question based on the following context: {context}'],
        ['user', '{input}']
    ]);

    const chain = template.pipe(model);

    const response = await chain.invoke({
        input: question,
        context: resultDocs
    });

    console.log(response)
}

main();