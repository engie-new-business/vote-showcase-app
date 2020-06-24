import { Component, Vue } from 'vue-property-decorator';
import Header from '../header/Header';

@Component({
    components: {
        Header,
    },
})
export default class Navbar extends Vue {
    public isOpen = false;

    public mounted() {
        this.handleResize();
    }

    public toggleIsOpen() {
        this.isOpen = !this.isOpen;
    }

    public logout() {
        this.$cookies.remove('access_token');
        this.$router.push('login');
    }

    private handleResize() {
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                this.isOpen = false;
            }
        });
    }
}
