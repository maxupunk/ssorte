<template>
    <div>
        <v-overlay :model-value="winner.show" absolute class="align-center justify-center">
            <v-card class="winner-overlay full-screen-card">
                <v-card-text class="text-center">
                    <h1 class="winner-number">{{ winner.number }}</h1>
                    <h2 class="winner-name">{{ winner.name }}</h2>
                    <v-img src="https://vippremiacoees.com/products/1711125215.png" height="230px" />
                    <p class="winner-date">{{ correntDate }}</p>
                </v-card-text>
            </v-card>
        </v-overlay>
        <canvas ref="confettiCanvas" class="confetti-canvas"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import confetti from 'canvas-confetti';

const props = defineProps({
    winner: {
        type: Object,
        required: true,
    },
})

watch(() => props.winner.show,
    (value) => {
        if (value) {
            runConfetti();
        }
    },
    { deep: true }
);

const correntDate = computed(() => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
});

const confettiCanvas = ref<HTMLCanvasElement | null>(null);
const colors = ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'];

async function runConfetti() {
    if (confettiCanvas.value) {
        const myConfetti = confetti.create(confettiCanvas.value, {
            resize: true,
            useWorker: true,
        });
        while (props.winner.show) {
            myConfetti({
                particleCount: randomInRange(70, 160),
                angle: 90,
                spread: 360,
                origin: {
                    x: Math.random(),
                    y: Math.random()
                },
                colors: colors
            });
            await sleep(randomInRange(200, 1000))
        }
    }
};

function randomInRange(min: any, max: any) {
    return Math.random() * (max - min) + min;
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'C' || event.key === 'c') {
    props.winner.show = !props.winner.show;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.full-screen-card {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.winner-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 1);
}

.winner-number {
    color: #fff;
    font-size: 18rem;
    margin-bottom: 0px;
}

.winner-name {
    color: #fff;
    font-size: 8rem;
    margin-bottom: 0.5rem;
}

.winner-date {
    color: #ffeb3b;
    font-size: 3rem;
}

.confetti-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
}
</style>