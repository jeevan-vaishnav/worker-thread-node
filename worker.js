const { parentPort, workerData } = require('node:worker_threads');
// const fetch = require('node-fetch'); // Install node-fetch or use the built-in fetch in Node 18+

// Dynamically import node-fetch (ES Module)
async function fetchModule() {
    return await import('node-fetch'); // Import node-fetch dynamically
  }

//fetch data from the api
async function fetchData(endpoint){
    const { default: fetch } = await fetchModule(); // Fetch module default export

    const res = await fetch(endpoint);
    const data  = await res.json();
    return data
}

function performCalculation(data){
     // Check the type of data and log it
  console.log('Performing calculation on:', data);
  
  // Ensure the data is in the expected format
  if (Array.isArray(data)) {
    return {
      endpoint: workerData.endpoint,
      totalItems: data.length // Calculate total items if it's an array
    };
  } else if (typeof data === 'object' && data !== null) {
    // Handle case where data is an object (e.g., for products or users)
    return {
      endpoint: workerData.endpoint,
      totalItems: Object.keys(data).length // Calculate total items if it's an object
    };
  } else {
    throw new Error('Data is not in a recognized format');
  }
}

async function processApiData(){
    try {
        const data  = await fetchData(workerData.endpoint);//fetch api data
        const result = performCalculation(data);
        // console.log(result)
        parentPort.postMessage(result);
    } catch (error) {
        parentPort.postMessage({ error: error.message });
    }
}

// Execute the worker function
processApiData();