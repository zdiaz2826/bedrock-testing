import { handler } from './kb-lambda'

async function testKbLambda() {
    const result = await handler({
        body: JSON.stringify({ question: 'What is the first step to migrate from the Bankrate module?'})
    } as any, {} as any)
    console.log(result)
}

testKbLambda()