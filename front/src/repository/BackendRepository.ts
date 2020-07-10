import axios from 'axios';
import createHTTP from '@/services/Service';
import ethAbi from 'ethereumjs-abi';
import * as ethUtil from 'ethereumjs-util';

export default class BackendRepository {
    private client: any;

    public constructor(url: string, apikey: string) {
        this.client = createHTTP(url, '');
    }

    public async getSetup() {
        const response = await this.client.get('/setup');

        const { voteContract } = response.data;
        return { voteContract };
    }

    public async vote(metatx): Promise<string> {
      const response = await this.client.post('/vote', metatx);

      const { trackingId } = response.data;
      return trackingId;
    }

    public async getReceipt(trackingId: string): Promise<any> {
      const response = await this.client.get(`/tx/${trackingId}`);

      return response.data;
    }
}
