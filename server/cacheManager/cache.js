const {createCache} = require('cache-manager');

// Create the memory cache with the desired configuration
const memoryCache = createCache({
    ttl: 10000,
    refreshThreshold: 3000,
  })

// Now you can use `memoryCache` to interact with the cache
// const memoryStore = require('cache-manager-memory-store');




module.exports.add_to_cache = async (key, value, exp_time = 0) => {
    try {
        (await memoryCache).set(key, value, { ttl: exp_time });
        console.log("added to cahce",key)
        return true;
    } catch (err) {
        console.log('Error while caching: ', err);
        throw err;
    }
};

module.exports.remove_from_cache=async(key , value, exp_time=0)=>{
    try{
      await memoryCache.del(key)
    }catch(error){
        console.log("An error occured while removing cache:",error)
        throw error;

    }
}

module.exports.get_from_cache = async (key) => {
    try {
        const data = await (await memoryCache).get(key);
        // console.log(`key===========>${key}`,data)
        return data;
    } catch (err) {
        console.log('Error while retrieving from cache: ', err);
        throw err;
    }
};

module.exports.inspectCache =async ()=>{
    try{
        const store = await (await memoryCache).store
        console.log("#$####################",await store.keys())
        return await store.keys()
        for (const key in store.keys) {
            console.log(`Key: ${key}, Value: ${JSON.stringify(store.get(key))}`);
        }
    }catch(err){
        console.log('Error while inspectoing from cache: ', err);
        throw err;
    }
}