import { handler } from './image-gen'

async function testImage() {
    const result = await handler({
        body: JSON.stringify({
            description: 'A car chase into the sunset'
        })
    } as any, {} as any)

    console.log(result)
}

testImage()