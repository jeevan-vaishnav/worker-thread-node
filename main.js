const { Worker} = require('node:worker_threads')

//list of api ends
const apiEndpoints = [
  'https://dummyjson.com/users',
  'https://dummyjson.com/posts',
  'https://dummyjson.com/products',
  'https://dummyjson.com/comments',
  'https://dummyjson.com/todos'
]

function runWorker(endpoint){
    // console.log(endpoint)
    return new Promise((resolve,reject)=>{
        const worker = new Worker('./worker.js',{
            workerData:{endpoint} // Pass the API endpoint to the worker
        })

        // Listen for messages from the worker (i.e., the fetched data and results)
        worker.on('message',resolve)
        // Handle worker errors
        worker.on('error',reject)
        //Handle worker exit
        worker.on('exit',(code)=>{
            if(code !== 0){
                reject(new Error(`Worker stopped the code ${code}`))
            }
        })
    })
}

//Main function to fetch data from all apis in parallel using workers 

async function fetchAllData(){
    console.log('fetchAllData');
    try {
        const results = await Promise.all(apiEndpoints.map(runWorker));
        console.log('All results:', results); // Log results from all workers

    } catch (error) {
        console.error("Error:", error)
    }
}

fetchAllData();