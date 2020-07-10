import { Component, Vue, Prop } from 'vue-property-decorator';
import { VoteABI } from '@/contract';
import config from '@/config';
import Web3 from 'web3';
import BackendRepository from '@/repository/BackendRepository';
import * as rocksideSdk from '@rocksideio/rockside-wallet-sdk';
import { rawEncode } from 'ethereumjs-abi';

@Component
export default class Voteapi extends Vue {
    @Prop({ required: true })
    private account!: string;

    @Prop({ required: true })
    private contractAddress!: string;

    @Prop({ required: true })
    private backend!: BackendRepository;

    @Prop({ required: false, default: null })
    private web3!: Web3;

    private yesCount: number = 0;
    private noCount: number = 0;
    private width: number = 0;
    private sendError: any = null;
    private voting: boolean = false;
    private contract: any = null;
    private txHash: string = '';

    public async mounted() {
        this.contract = new this.web3.eth.Contract(VoteABI, this.contractAddress);

        await this.updateVotes();
    }

    public async waitForTx(trackingId: string) {
        const isMined = async (): Promise<any> => {
          const response = await this.backend.getReceipt(trackingId);

          return response.receipt;
        };

        let receipt = await isMined();
        while (!receipt) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          receipt = await isMined();
        }

        this.txHash = receipt.transaction_hash;
    }

    public getEtherscanLink(txHash): string {
      return `https://ropsten.etherscan.io/tx/${txHash}`;
    }

    public async voteResults(): Promise<{ yes: string, no: string }> {
        const yes = await this.contract.methods.yes().call();
        const no = await this.contract.methods.no().call();
        return { yes, no };
    }

    public async updateVotes() {
        const count = await this.voteResults();
        this.yesCount = Number(count.yes);
        this.noCount = Number(count.no);
        this.width = (this.yesCount / (this.yesCount + this.noCount)) * 100;
    }

    public async vote(value: boolean) {
        try {
            this.voting = true;

            const trackingId = await this._voteMetaTX(value);

            await this.waitForTx(trackingId);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await this.updateVotes();

            this.voting = false;
        } catch (err) {
            this.sendError = err;
        }
    }

    public async _voteMetaTX(value: boolean): Promise<string> {
      const chainId = await this.web3.eth.net.getId();
      const domain = { chainId, verifyingContract: this.contractAddress };
      const destination =  '0x0000000000000000000000000000000000000000';
      const message = {
        signer: this.account,
        vote: Number(value),
      };

      const typedData = {
        types: {
          EIP712Domain: [
            { name: 'verifyingContract', type: 'address' },
            { name: 'chainId', type: 'uint256' },
          ],
          Vote: [
            { name: 'signer', type: 'address' },
            { name: 'vote', type: 'uint256' },
          ],
        },
        domain,
        primaryType: 'Vote',
        message,
      };


      const signature: string = await new Promise((resolve, reject) => {
        (this.web3 as any).currentProvider.send({
          method: 'eth_signTypedData_v4',
          params: [this.account, JSON.stringify(typedData)],
          from: this.account,
        }, (err, result) => {
          if (err) { return reject(err); }
          return resolve(result.result);
        });
      });


      const data = await this.contract.methods.voteWithSignature(this.account, value, signature).encodeABI();

      return await this.backend.vote({
        data,
      });
    }
}
