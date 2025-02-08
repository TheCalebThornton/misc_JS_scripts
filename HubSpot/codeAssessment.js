import { getHubSpotData, postHubSpotData, getHubSpotDataTestSample, getHubSpotDataTestSampleResults} from './services/apiClient.js';
import { sample1 } from './test/sampleJson.js';

export async function processHubSpotData() {
    let jsonData, output;
    try {
        const data = await getHubSpotData();
        jsonData = await data.json();
    } catch (error) {
        return error;
    }
    try {
        const data = await getHubSpotDataTestSample();
        jsonData = await data.json();
    } catch (error) {
        return error;
    }

    try {
        const data = await getHubSpotDataTestSampleResults();
        await data.json();
    } catch (error) {
        return error;
    }

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
            const startDate = new Date(call.startTime);
            const endDate = new Date(call.endTime);
            
            // Get all dates between start and end
            const currentDate = new Date(startDate);
            while (currentDate < endDate) {
                let dateStr = currentDate.toUTCString();
                dateStr = `${currentDate.getUTCFullYear()}-${currentDate.getUTCMonth()+1}-${currentDate.getUTCDate()}`
                let startDateStr = startDate.toUTCString();
                startDateStr = `${startDate.getUTCFullYear()}-${startDate.getUTCMonth()+1}-${startDate.getUTCDate()}`
                let endDateStr = endDate.toUTCString();
                endDateStr = `${endDate.getUTCFullYear()}-${endDate.getUTCMonth()+1}-${endDate.getUTCDate()}`
                
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
                if (currentDate > startDate && currentDate < endDate) {
                    callsByDay[dateStr].push({ 
                        time: Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()),
                        type: 'start',
                        callId: call.id 
                    });
                }
                
                currentDate.setUTCDate(currentDate.getUTCDate() + 1);
            }
        });

        // Calculate max concurrent calls for each day for this customer
        customerDailyConcurrentCalls[customerId] = {};
        Object.keys(callsByDay).forEach(date => {
            const events = callsByDay[date];
            events.sort((a, b) => a.time - b.time);
            console.log('events, sorted:', events);
            
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
