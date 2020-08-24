import { Component, Vue } from 'vue-property-decorator';
import config from '@/config';
import BackendRepository from '@/repository/BackendRepository';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Rockside, ROPSTEN, MAINNET, Wallet } from '@rocksideio/rockside-wallet-sdk';
import Vote from '../../components/vote/Vote';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import Fortmatic from 'fortmatic';

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

      const provider: any = await this.connectWeb3Modal();

      this.web3 = new Web3(provider);
      this.isRopsten = (await this.web3.eth.net.getId()) === 3;
      this.account = (await this.web3.eth.getAccounts())[0];

      console.log('isRopsten', this.isRopsten, 'account', this.account);
    }

    public connectWeb3Modal() {
      const providerOptions = {
        fortmatic: {
          package: Fortmatic, // required
          options: {
            key: 'pk_test_813022A1288975BC', // required
          },
        },
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: '2e297f45a4fd4a84b371c9fe432e2e6f',
          },
        },
      };


      return new Promise((resolve, reject) => {
        const web3Modal = new Web3Modal({
          network: 'ropsten',
          providerOptions,
        });

        web3Modal.toggleModal();

        // subscribe to connect
        web3Modal.on('connect', (provider: any) => {
          resolve(provider);
        });

      });

    }
}
