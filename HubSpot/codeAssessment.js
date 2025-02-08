import { getHubSpotData, postHubSpotData } from './services/apiClient.js';

export async function processHubSpotData() {
    let jsonData;
    let output;
    try {
        const data = await getHubSpotData();
        jsonData = await data.json();
    } catch (error) {
        return error;
    }

    // Process HubSpot data
    output = jsonData;

    try {
        await postHubSpotData(output);
    } catch (error) {
        return error;
    }

    return output;
}
