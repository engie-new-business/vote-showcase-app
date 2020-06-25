import { Component, Vue } from 'vue-property-decorator';
import config from '@/config';
import BackendRepository from '@/repository/BackendRepository';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Rockside, ROPSTEN, MAINNET, Wallet } from '@rocksideio/rockside-wallet-sdk';
import Vote from '../../components/vote/Vote';
import Web3 from 'web3';

@Component({
    components: {
        Vote,
    },
})

export default class Metamask extends Vue {
    private hasMetamask: boolean = false;
    private isRopsten: boolean = false;

    private account: string = '';

    private backend = new BackendRepository(config.rocksideBackend, '');
    private web3: Web3 | null = null;

    private voteContract: string = '';

    public async mounted() {
      const ethereum: any = (window as any).ethereum;
      this.hasMetamask = typeof ethereum !== 'undefined';
      const { voteContract } = await this.backend.getSetup();
      this.voteContract = voteContract;

      await this.connectMetamask();
    }

    public async connectMetamask() {
        if (!this.hasMetamask) { return; }

        const ethereum: any = (window as any).ethereum;
        const accounts = await ethereum.enable();

        this.account = accounts[0];
        this.web3 = new Web3(ethereum);

        this.isRopsten = (await this.web3.eth.net.getId()) === 3;
    }
}
