// @ts-nocheck
import { error } from '@sveltejs/kit';
import fetch from 'node-fetch';
import { SECRET_VISION_ENDPOINT, SECRET_VISION_KEY } from '$env/static/private';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const imageUrl = body.imageUrl;

        const visionEndpoint = SECRET_VISION_ENDPOINT + '/computervision/imageanalysis:segment?api-version=2023-02-01-preview&mode=backgroundRemoval';
        const visionKey = SECRET_VISION_KEY;

        const response = await fetch(visionEndpoint, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': visionKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: imageUrl })
        });

        const imageBytes = await response.arrayBuffer();

        return new Response(imageBytes, {
            headers: {
                'Content-Type': 'image/png'
            }
        });
    } catch (err) {
        throw error(400, err.message);
    }
}
