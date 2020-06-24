import Vue from 'vue';
import Toasted from 'vue-toasted';

Vue.use(Toasted);

Vue.toasted.register(
    'error',
    (payload) => {
        if (!payload.message) {
            return 'Une erreur est survenue.';
        }

        return payload.message;
    },
    {
        theme: 'toasted-primary',
        position: 'bottom-right',
        duration: 5000,
        className: 'msg-error bg-red-100',
        type: 'error',
        singleton: true,
    },
);

Vue.toasted.register(
    'success',
    (payload) => {
        if (!payload.message) {
            return 'Action bien effectuée';
        }

        return payload.message;
    },
    {
        theme: 'toasted-primary',
        position: 'top-center',
        duration: 5000,
        type: 'success',
        singleton: true,
    },
);

Vue.toasted.register(
    'info',
    (payload) => {
        if (!payload.message) {
            return 'Action bien effectuée';
        }

        return payload.message;
    },
    {
        theme: 'bubble',
        position: 'bottom-right',
        duration: 1500,
        type: 'info',
        singleton: true,
    },
);
