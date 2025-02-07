const GET_API = 'https://api.genderize.io?name=luc';
const POST_API = '';
const apiKey = 'your_api_key_here';

const getHubSpotData = async () => {
    return fetch(GET_API, {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${apiKey}`,
        //     'Content-Type': 'application/json'
        // }
    });

}

const postHubSpotData = async (contactData) => {
    return fetch(POST_API, {
        method: 'POST',
        // headers: {
        //     'Authorization': `Bearer ${apiKey}`,
        //     'Content-Type': 'application/json'
        // },
        body: JSON.stringify(contactData)
    });
}

async function processHubSpotData() {
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
