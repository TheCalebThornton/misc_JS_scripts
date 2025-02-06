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
    fetch(POST_API, {
        method: 'POST',
        // headers: {
        //     'Authorization': `Bearer ${apiKey}`,
        //     'Content-Type': 'application/json'
        // },
        body: JSON.stringify(contactData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function processHubSpotData() {
    try {
        const data = await getHubSpotData();
        const jsonData = await data.json();
        return jsonData;
    } catch (error) {
        return error;
    }
}
