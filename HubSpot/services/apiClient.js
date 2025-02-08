const GET_API = 'https://api.genderize.io?name=luc';
const POST_API = '';
const apiKey = 'your_api_key_here';

export const getHubSpotData = async () => {
    return fetch(GET_API, {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${apiKey}`,
        //     'Content-Type': 'application/json'
        // }
    });
}

export const postHubSpotData = async (contactData) => {
    return fetch(POST_API, {
        method: 'POST',
        // headers: {
        //     'Authorization': `Bearer ${apiKey}`,
        //     'Content-Type': 'application/json'
        // },
        body: JSON.stringify(contactData)
    });
}