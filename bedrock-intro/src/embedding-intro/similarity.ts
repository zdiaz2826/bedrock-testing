// compare the two vectors/embeddings
// dot product is an operation in linear algebra used compute the similarity between two vectors
/*
const vector1 = [1, 2, 3];
const vector2 = [4, 5, 6];
const result = dotProduct(vector1, vector2); // Returns 32 (1*4 + 2*5 + 3*6)
*/
export function dotProduct(a: number[], b: number[]) {
    return a.map((value, index) => value * b[index]).reduce((a, b) => a + b, 0);
}

// find the cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]) {
    // The dot product is the first step in calculating cosine similarity
    // because it represents the numerator in the cosine similarity formula:
    const product = dotProduct(a, b);

    const aMagnitude = Math.
        // Square root of the sum of the squares of the values in the array
        sqrt(
            // Square each value in the array
            a.map(value => value * value)
            // Sum all the values in the array
            .reduce((a, b) => a + b, 0)
        );
    const bMagnitude = Math
        // Square root of the sum of the squares of the values in the array
        .sqrt(
            // Square each value in the array
            b.map(value => value * value)
            // Sum all the values in the array
            .reduce((a, b) => a + b, 0)
        );

    const cosineSimilarity = product / (aMagnitude * bMagnitude);

    return cosineSimilarity;
}

// Vectors pointing in similar directions have larger dot products = 1
// Vectors pointing in very different directions have dot product = 0
//              [x,y]
const vector1 = [1, 0];  // Vector pointing right
const vector2 = [0, 1];  // Vector pointing up
const vector3 = [1, 1];  // Vector pointing diagonally

// console.log('Dot Product', dotProduct(vector1, vector3));
// console.log('Consine similarity', cosineSimilarity(vector1, vector3));
