<template>
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
        <v-card-title class="text-h3">Formula aplicada
          <hr>
        </v-card-title>
        <v-card-text class="text-h2">
          <div>
            <span style="color: red;">A</span> = 21
            <span style="color: blue;">C</span> = 1
            <span style="color: purple;">M</span> = 1000000
          </div>
          <div>
            (<span style="color: red;">A</span> x <span style="color: green;">NUMERO</span> +
            <span style="color: blue;">C</span>) % <span style="color: purple;">M</span>
          </div>
        </v-card-text>
      </v-sheet>
    </v-col>
    <v-col cols="12" class="text-center numGanhador" @click="startSort()">
      <span class="gradient-text">
        {{ winnerNumber }}
      </span>
    </v-col>
    <v-col cols="12" class="text-center cor-preto pa-8">
      <v-img src="https://vippremiacoees.com/products/1711125215.png" height="230px" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const lotteryNumber = ref('123456')
const winnerNumber = ref('654321')

// Função para atualizar o número do ganhador dinamicamente
function updateWinnerNumber() {
  winnerNumber.value = Math.floor(Math.random() * 999999)
}

function startSort() {
  console.log('Sorteando...')
}

// Exemplo de atualização após 5 segundos
setInterval(() => {
  updateWinnerNumber()
}, 100)

</script>

<style scoped>
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

.gradient-text {
  background: linear-gradient(90deg, green, #FFD500, red);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  color: transparent;
  animation: gradientMove 3s linear infinite alternate;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 100% 50%;
  }
}
</style>