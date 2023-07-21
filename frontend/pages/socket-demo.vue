<script setup>
import {io} from 'socket.io-client'

let socket
const gameId = '123'
const playerId = '456'
const handleSocketConnect = () => {
  console.log('connect')
  socket = io('http://localhost:8000')

  socket.on('connected', () => {
    console.log('connected')
    // socket.emit('message', 'hello server!')
  })
  socket.on("message", (data) => {
    console.log(data)
  })
}

const handleMessage = () => {
  socket.emit('message', 'hello server!')
}
const handleChoice = () => {
  const params = {
    gameId,
    playerId,
    choise: 'keepGoing'
  }
  socket.emit('player_choice', params)
}

const handleStartGame = () => {
  const params = {
    gameId,
  }
  socket.emit('start_game', params)
}

const handleReady = () => {
  const params = {
    gameId,
    playerId,
    ready: true,
  }
  socket.emit('player_ready', params)
}

</script>
<template>
  <div>
    <button @click="handleSocketConnect">連線</button>
    <button @click="handleMessage">傳訊息</button>
    <button @click="handleChoice">選擇</button>
    <button @click="handleStartGame">開始遊戲</button>
    <button @click="handleReady">已準備好</button>
  </div>
</template>
