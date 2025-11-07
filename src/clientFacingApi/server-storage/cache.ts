import NodeCache from "node-cache";

// Creating a cache instance with a default TTL of 20 minutes
const myCache = new NodeCache({ stdTTL: 1200 }); // Cache expiry time set to 20 minute

// Set cache data
const setCache = (key: string, value: any): void => {
  myCache.set(key, value);
};

// Retrieve cached data
const getCache = (key: string): any => {
  return myCache.get(key);
};

//Force deleteCache
const deleteCache = (key: string): void => {
  myCache.del(key);
};

const validateCache = (key:string) =>{
 return myCache.has(key)
}
// Exporting all cache functions so they can be used in other files
export { setCache, getCache, deleteCache ,validateCache};
