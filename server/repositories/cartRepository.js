import redis from '../redis/redis.js';

class cartRepository{
    constructor(){
        this.client = redis.client;
        redis.connect();
    }

    async createOrUpdateCart(cart){
        const TTL = 60 * 60 * 24 * 30;

        return await this.client.set(cart.id,JSON.stringify(cart),{
            EX: TTL
        })
    }

    async getCart(id){
        return JSON.parse(await this.client.get(id));
    }

    async deleteCart(id){
        await this.client.del(id);
    }
}

export default  new cartRepository();