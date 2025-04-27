// index.mjs
// Book Recommendation App - Backend (AWS Lambda)
// By Genesis Soebagyo

import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import fetch from 'node-fetch';

const dynamo = new DynamoDBClient({ region: "us-east-2" });
const TABLE_NAME = "BookCache";

export const handler = async (event) => {
    const { genre } = JSON.parse(event.body);

    if (!genre) {
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({ error: "Genre is required." })
        };
    }

    try {
        // Check if the genre already exists in DynamoDB
        const cached = await dynamo.send(new GetItemCommand({
            TableName: TABLE_NAME,
            Key: {
                "Genre": { S: genre.toLowerCase() }
            }
        }));

        if (cached.Item) {
            // Return cached data
            const recommendations = JSON.parse(cached.Item.Recommendations.S);
            return buildResponse(200, { recommendations });
        }

        // Otherwise, fetch from Google Books API
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(genre)}&maxResults=5`);
        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return buildResponse(404, { error: `No books found for subject "${genre}".` });
        }

        const recommendations = data.items.map(item => ({
            title: item.volumeInfo.title || "Unknown Title",
            author: item.volumeInfo.authors?.[0] || "Unknown Author",
            thumbnail: item.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192?text=No+Cover"
        }));

        // Cache in DynamoDB
        await dynamo.send(new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                "Genre": { S: genre.toLowerCase() },
                "Recommendations": { S: JSON.stringify(recommendations) }
            }
        }));

        return buildResponse(200, { recommendations });

    } catch (error) {
        console.error(error);
        return buildResponse(500, { error: "Internal server error." });
    }
};

// Helper to build a Lambda HTTP response
function buildResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify(body)
    };
}
