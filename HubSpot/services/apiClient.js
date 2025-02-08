const apiKey = 'bfcce3503b5b3ac3c9e02737d9bb';
const GET_API = `https://candidate.hubteam.com/candidateTest/v3/problem/dataset?userKey=${apiKey}`;
const POST_API = `https://candidate.hubteam.com/candidateTest/v3/problem/result?userKey=${apiKey}`;

export const getHubSpotData = async () => {
    return fetch(GET_API, {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${apiKey}`,
        //     'Content-Type': 'application/json'
        // }
    });
}

export const getHubSpotDataTestSample = async () => {
    return fetch('https://candidate.hubteam.com/candidateTest/v3/problem/test-dataset?userKey=bfcce3503b5b3ac3c9e02737d9bb', {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${apiKey}`,
        //     'Content-Type': 'application/json'
        // }
    });
}

export const getHubSpotDataTestSampleResults = async () => {
    return fetch('https://candidate.hubteam.com/candidateTest/v3/problem/test-dataset-answer?userKey=bfcce3503b5b3ac3c9e02737d9bb', {
        method: 'GET',
        // headers: {
        //     'Authorization': `Bearer ${apiKey}`,
        //     'Content-Type': 'application/json'
        // }
    });
}

export const postHubSpotData = async (customerBillingList) => {
    return fetch(POST_API, {
        method: 'POST',
        headers: {
        //     'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ results: customerBillingList })
    });
}