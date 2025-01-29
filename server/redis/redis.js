import redis from 'redis';

const client = redis.createClient();

const connect = async()=>{
    await client.connect();
    console.log('Connected to Redis');
}

export default {client,connect}