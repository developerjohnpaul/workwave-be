"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCache = exports.deleteCache = exports.getCache = exports.setCache = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
// Creating a cache instance with a default TTL of 20 minutes
const myCache = new node_cache_1.default({ stdTTL: 1200 }); // Cache expiry time set to 20 minute
// Set cache data
const setCache = (key, value) => {
    myCache.set(key, value);
};
exports.setCache = setCache;
// Retrieve cached data
const getCache = (key) => {
    return myCache.get(key);
};
exports.getCache = getCache;
//Force deleteCache
const deleteCache = (key) => {
    myCache.del(key);
};
exports.deleteCache = deleteCache;
const validateCache = (key) => {
    return myCache.has(key);
};
exports.validateCache = validateCache;
