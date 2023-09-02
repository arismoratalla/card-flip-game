import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/game',
            name: 'game',
            component: () => import('../views/Game.vue'),
        },
    ],
});

export default router;
