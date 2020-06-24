import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {
    public isDropdownOpen = false;

    public mounted() {
        const onEscape = (e: any) => {
            if (!this.isDropdownOpen || e.key !== 'Escape') {
                return;
            }
            this.isDropdownOpen = false;
        };
        document.addEventListener('keydown', onEscape);

        this.$on('hook:destroyed', () => {
            document.removeEventListener('keydown', onEscape);
        });
    }
    public onDropdownButtonClick() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }
}
