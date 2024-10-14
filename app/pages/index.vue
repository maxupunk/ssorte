<template>
  <!-- Overlay de Pausa -->
  <v-overlay v-model="pause" class="align-center justify-center">
    <span class="text-pause">Pausado</span>
  </v-overlay>

  <v-row justify="center" class="ma-2">
    <v-col cols="6" class="text-center">
      <v-sheet color="success" class="head">
        <v-card-title class="text-h3">Numero da Loteria</v-card-title>
        <v-card-text class="numLoteria">
          {{ lotteryNumber }}</v-card-text>
      </v-sheet>
    </v-col>
    <v-col cols="6" class="text-center text-h3">
      <v-sheet color="success" class="head">
        <v-card-title class="text-h3">Fórmula matemática:
          <hr>
        </v-card-title>
        <v-card-text>
          <div class="text-h4 ma-4">
            <math xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi class="text-light-blue-darken-4">a</mi>
                <mo>= {{ calcA }}</mo>
                <mi class="text-yellow-accent-4">numero</mi>
                <mo>= {{ lotteryNumber }}</mo>
                <mi class="text-cyan-darken-4">c</mi>
                <mo>= {{ calcC }}</mo>
                <mi class="text-deep-purple-accent-4">m</mi>
                <mo>= {{ calcM }}</mo>
              </mrow>
            </math>
          </div>
          <div class="text-h2">
            <math xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mo>(</mo>
                <mi class="text-light-blue-darken-4">a</mi>
                <mo>&#x22C5;</mo>
                <mi class="text-yellow-accent-4">numero</mi>
                <mo>+</mo>
                <mi class="text-cyan-darken-4">c</mi>
                <mo>)</mo>
                <mo>mod</mo>
                <mi class="text-deep-purple-accent-4">m</mi>
              </mrow>
            </math>
          </div>
        </v-card-text>
      </v-sheet>
    </v-col>
    <v-col cols="12" class="text-center numGanhador">
      {{ currentNumber }}
    </v-col>
    <v-col cols="12" class="text-center cor-preto pa-8">
      <v-img src="https://vippremiacoees.com/products/1711125215.png" height="230px" />
    </v-col>
  </v-row>

  <v-dialog v-model="showNetworkErrorDialog" max-width="900">
    <v-card>
      <v-card-title class="headline">Erro de Conexão</v-card-title>
      <v-card-text>
        <h1>
          Ocorreu um problema de conexão de rede. Por favor, verifique sua conexão e tente novamente.
        </h1>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="showNetworkErrorDialog = false">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <overlay-win :winner="winner" />

</template>

<script setup lang="ts">
import { ref } from 'vue'
import overlayWin from '~/components/overlayWin.vue';

const lotteryNumber = ref('596232')
const currentNumber = ref()
currentNumber.value = lotteryNumber.value
const pause = ref(false)
const play = ref(false)
const showNetworkErrorDialog = ref(false);
const timeSleep = ref(1000)
const winner = ref({
  number: '',
  name: '',
  date: '',
  show: false,
})

// Modulus
const calcM = 1000000;
// Multiplicador e incremento escolhidos para satisfazer condições LCG (Linear Congruential Generator) de período completo
const calcA = 21;
const calcC = 1;

// função que aplica a Algoritmo do gerador congruencial linear
function algorithm(number: string) {
  const numberInt = parseInt(number);
  // resultado da operação
  const result = (calcA * numberInt + calcC) % calcM;
  return result.toString().padStart(6, '0');
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'P' || event.key === 'p') {
    pause.value = !pause.value;
  }
  if (event.key === 'S' || event.key === 's') {
    startSort();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

async function startSort() {
  if (play.value) {
    return
  }
  if (pause.value) {
    pause.value = false;
  }
  currentNumber.value = lotteryNumber.value;
  let generatedNumbers = new Set();
  generatedNumbers.add(currentNumber.value);
  // Loop infinito
  play.value = true;
  while (1) {
    console.log("Numero sorteado: " + currentNumber.value);
    if (pause.value) {
      await sleep(100)
      continue
    }
    if (timeSleep.value > 0) {
      await sleep(timeSleep.value)
      timeSleep.value -= 40
    }
    const isParticipant = await fetchSorte(currentNumber.value)
    if (isParticipant && isParticipant.body) {
      const nameWinner = isParticipant.body.orderproduct?.order?.customer?.name ? isParticipant.body.orderproduct?.order?.customer?.name : 'Nome do Ganhador'
      const dateWinner = isParticipant.body.orderproduct?.order?.createdAt ? isParticipant.body.orderproduct?.order?.createdAt : '00/00/0000'
      winner.value = {
        number: isParticipant.body.number.toString(),
        name: nameWinner,
        date: dateWinner,
        show: true,
      }

      break
    }
    // Apply the algorithm
    let nextNumber = algorithm(currentNumber.value)

    // Check if the number was already generated
    if (generatedNumbers.has(nextNumber)) {
      console.log(nextNumber + " repetido");
    } else {
      generatedNumbers.add(nextNumber);
    }
    // Update currentNumber
    currentNumber.value = nextNumber;
  }
  play.value = false;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para realizar a requisição GET
async function fetchSorte(id: string) {
  try {
    return await $fetch(`/api/number/${id}`, {
      retry: 999,
      retryDelay: 600, // ms
    })
  } catch (error) {
    pause.value = true;
    showNetworkErrorDialog.value = true;
  }
}

</script>

<style scoped>
.text-pause {
  font-size: 100px;
  font-weight: bold;
  color: rgb(255, 255, 255);
  text-shadow: 0px 0px 50px rgb(0, 0, 0);
  animation: blinking 1s infinite;
}

@keyframes blinking {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.numLoteria {
  margin-top: -40px;
  font-size: 180px;
}

.numGanhador {
  font-size: 300px;
  font-weight: bold;
}

.head {
  height: 25vh;
}

.cor-preto {
  background-color: black;
}
</style>