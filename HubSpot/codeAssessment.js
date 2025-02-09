import { getHubSpotData, postHubSpotData, getHubSpotDataTestSampleResults} from './services/apiClient.js';
import { sample1 } from './test/sampleJson.js';

export async function processHubSpotData() {
    let jsonData = sample1, output;
    try {
        const data = await getHubSpotData();
        jsonData = await data.json();
    } catch (error) {
        return error;
    }
    // try {
    //     const data = await getHubSpotDataTestSample();
    //     jsonData = await data.json();
    // } catch (error) {
    //     return error;
    // }

    // try {
    //     const data = await getHubSpotDataTestSampleResults();
    //     await data.json();
    // } catch (error) {
    //     return error;
    // }

    // Group calls by customer
    const callsByCustomer = {};
    jsonData.callRecords.forEach(call => {
        if (!callsByCustomer[call.customerId]) {
            callsByCustomer[call.customerId] = [];
        }
        callsByCustomer[call.customerId].push({
            id: call.callId,
            startTime: call.startTimestamp,
            endTime: call.endTimestamp
        });
    });

    // Calculate max concurrent calls for each customer by day
    const customerDailyConcurrentCalls = {};
    
    Object.keys(callsByCustomer).forEach(customerId => {
        const customerCalls = callsByCustomer[customerId];
        const callsByDay = {};
        
        customerCalls.forEach(call => {
            const startTimestamp = call.startTime;
            const endTimestamp = call.endTime;
            
            // Get all dates between start and end
            let currentTimestamp = startTimestamp;
            while (currentTimestamp < endTimestamp) {
                let dateStr = new Date(currentTimestamp).toISOString().split('T')[0];
                let startDateStr = new Date(startTimestamp).toISOString().split('T')[0];
                let endDateStr = new Date(endTimestamp).toISOString().split('T')[0];
                
                if (!callsByDay[dateStr]) {
                    callsByDay[dateStr] = [];
                }
                
                // Only add start event on the first day
                if (dateStr === startDateStr) {
                    callsByDay[dateStr].push({ 
                        time: call.startTime, 
                        type: 'start',
                        callId: call.id 
                    });
                }
                
                // Only add end event if we're on the end date
                if (dateStr === endDateStr) {
                    callsByDay[dateStr].push({ 
                        time: call.endTime, 
                        type: 'end',
                        callId: call.id 
                    });
                }
                
                // For days in between, add start at beginning of day
                const currentDate = new Date(currentTimestamp);
                if (currentTimestamp > startTimestamp && currentTimestamp < endTimestamp) {
                    callsByDay[dateStr].push({ 
                        time: Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0,0,0,0),
                        type: 'start',
                        callId: call.id 
                    });
                }

                // Increment to the next day
                currentDate.setDate(currentDate.getDate() + 1);
                currentTimestamp = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 0,0,0,0);
            }
        });

        // Calculate max concurrent calls for each day for this customer
        customerDailyConcurrentCalls[customerId] = {};
        Object.keys(callsByDay).forEach(date => {
            const events = callsByDay[date];
            events.sort((a, b) => a.time - b.time);
            
            let currentCalls = 0;
            let maxConcurrentCalls = 0;
            let maxConcurrentTimestamp = 0;
            let activeCalls = new Set();
            let maxConcurrentCallIds = new Set();
            
            events.forEach(event => {
                if (event.type === 'start') {
                    activeCalls.add(event.callId);
                    currentCalls++;
                    if (currentCalls > maxConcurrentCalls) {
                        maxConcurrentCalls = currentCalls;
                        maxConcurrentTimestamp = event.time;
                        maxConcurrentCallIds = new Set(activeCalls);
                    }
                } else {
                    activeCalls.delete(event.callId);
                    currentCalls--;
                }
            });
            
            customerDailyConcurrentCalls[customerId][date] = {
                maxConcurrentCalls,
                timestamp: maxConcurrentTimestamp,
                callIds: [...maxConcurrentCallIds]
            };
        });
    });

    // Format the output as required
    output = Object.entries(customerDailyConcurrentCalls).flatMap(([customerId, dailyCalls]) => 
        Object.entries(dailyCalls).map(([date, data]) => ({
            customerId: parseInt(customerId),
            date,
            maxConcurrentCalls: data.maxConcurrentCalls,
            timestamp: data.timestamp,
            callIds: data.callIds
        }))
    );

    try {
        await postHubSpotData(output);
    } catch (error) {
        return error;
    }

    return output;
}
