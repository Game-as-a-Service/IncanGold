<script setup>
import {io} from 'socket.io-client'
const Choice = {
    KeepGoing: "keepGoing",
    Quit: "quit",
}
const users = [
  {
    name: 'Arong',
    playerId: 'arong',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhcm9uZyIsImlhdCI6MTY5MzAxODkxOH0.sHACAo3KXz392iRh0st6IcXPavCe8Kb7hCdKnMqXTNA'
  },
  {
    name: 'Hansen Boii',
    playerId: 'hansen_boii',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJoYW5zZW5fYm9paSIsImlhdCI6MTY5MzAxODkxOH0.rE7PhOTFovBC2qb3TMhc_G-mT8WFjkJJNt0y7ZRpha8'
  },
  {
    name: 'Frohman',
    playerId: 'frohman',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmcm9obWFuIiwiaWF0IjoxNjkzMDIyNzE5fQ.97cqlSbBb32bSn-y_RYktHzH1MXmigNINI2-fsg5gPc'
  },
  {
    name: 'Adrian',
    playerId: 'adrian',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZHJpYW4iLCJpYXQiOjE2OTMwMjI3MTl9.b9qvDGPj4JjLkP5oHmWT4O4fdkHwMzA3GinzamW1wj0'
  },
  {
    name: 'Gina',
    playerId: 'gina',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJnaW5hIiwiaWF0IjoxNjkzMDIyNzE5fQ.i9e9jiAlOgh6je3gEoMKZzUKCz5swixXMEIgBxIf1Hc'
  },
  {
    name: 'Sean',
    playerId: 'sean',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzZWFuIiwiaWF0IjoxNjkzMDIzMDAzfQ.2mqgyAEVhHqPuh8Hu9PNqF0HeYpDQ3b09XKRhrVGv8c'
  },
  {
    name: 'Tux',
    playerId: 'tux',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0dXgiLCJpYXQiOjE2OTMwMjMwMDN9.cyybssFH3eqUjXW7oHFbJ0boSx2hZql2mnE3oLwVWI8'
  },
  {
    name: 'Sonidanz',
    playerId: 'sonidanz',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzb25pZGFueiIsImlhdCI6MTY5MzAyMzAwM30.okkzuB9HMfD3GMQ6sYON-9pAWlIpVPo26nJDe7rn75w'
  },
]
const user = ref(users[0])
const room = ref({})
const rooms = ref([])
const game = ref({})
const winner = ref({})
const roomName = ref('')
const selectRoomId = ref('')
const HOST = 'https://incan-gold.fly.dev' 
const endScores = ref([])
// const HOST = 'http://localhost:8000' 
// phase = DISCONNECT WAITING, PLAYING, END
const phase = ref('DISCONNECT')
let socket
const connected = ref(false)
const handleSocketConnect = () => {
  const token = user.value.token
  socket = io(`${HOST}/`, { auth: { token }, transports:['websocket', 'polling'] })
  phase.value = 'WAITING'
  socket.on('connected', () => {
    console.log('connected')
    
    // socket.emit('message', 'hello server!')
  })
  socket.on("message", (data) => {
    console.log('get message:', data)
    if(data.room) {
      room.value = data.room
    }
    if(data.game) {
      phase.value = 'PLAYING'
      game.value = data.game
    }
    const gameOverEvent = data.events.find(event => event.name === 'GameOver')
    if(gameOverEvent) {
      phase.value = 'END'
      winner.value = gameOverEvent.data.winnerId
      endScores.value = gameOverEvent.data.explorers
    }
  })
  handleSearchRoom()
  connected.value = true
}

const handleCreateRoom = () => {
  const params = {
    playerId: user.value.playerId,
    roomName: roomName.value,
  }
  useFetch(`${HOST}/rooms`, {
    method: 'POST',
    body: params
  })
  // const params = {
  //   gameId,
  //   playerId,
  //   playerName: users[0].name,
  // }
  // socket.emit('create_room', params)
}
const handleJoinRoom = (room) => {
  const roomId = room.id
  const params = {
    playerId: user.value.playerId,
  }
  useFetch(`${HOST}/rooms/${roomId}/players`, {
    method: 'POST',
    body: params
  })
}

const handleExitRoom = () => {
  const roomId = room.value.id
  const playerId = user.value.playerId
  useFetch(`${HOST}/rooms/${roomId}/players/${playerId}`, {
    method: 'DELETE',
  })
  room.value = {}
  handleSearchRoom()
}
const handleSearchRoom = () => {
  useFetch(`${HOST}/rooms/`, {
    method: 'GET',
  }).then(res => {
    rooms.value = res.data._value
  })
}
const handleReady = () => {
  const roomId = room.value.id
  const params = {
    playerId: user.value.playerId,
  }
  useFetch(`${HOST}/rooms/${roomId}/ready`, {
    method: 'PATCH',
    body: params
  })
}

const handleMessage = () => {
  socket.emit('message', 'hello server!')
}


const handleStartGame = () => {
  const roomId = room.value.id
  // const params = {
  //   playerIds: Object.values(room.value.seats).filter(seat=>seat.state === 'READY').map(seat => seat.playerId),
  // }
  useFetch(`${HOST}/rooms/${roomId}/start`, {
    method: 'POST',
    // body: params
  })

}
const handleChoice = (choice) => {
  const roomId = room.value.id
  const params = {
    explorerId: user.value.playerId,
    choice,
  }
  useFetch(`${HOST}/games/${roomId}/choice`, {
    method: 'PATCH',
    body: params
  })
}
const seats = computed(() => {
  if(!room.value.id) return []
  return Object.entries(room.value.seats).map(([seatId, seat]) => {
    return {
      seatId,
      ...seat,
    }
  })
})
const roomPlayersCount = computed(() => {
  if(!room.value.id) return 0
  return Object.values(room.value.seats).filter(seat=>seat.playerId).length
})
const canChoise = computed(() => {
  if(!game.value.explorers) return false
  return game.value.explorers.find(explorer => explorer.explorerId === user.value.playerId && explorer.choice === 'NotSelected')
})
// const handleReady = () => {
//   const params = {
//     gameId,
//     playerId,
//     ready: true,
//   }
//   socket.emit('player_ready', params)
// }
</script>
<template>
  <div>
    <div>印加寶藏臨時demo頁</div>
  </div>
  <div v-if="!connected">
    <span>選擇身份</span>
    <select v-model="user">
      <option v-for="user in users" :key="user.playerId" :value="user">{{user.name}}</option>
    </select>
  </div>
  <div v-else>歡迎回來，探險者 {{ user.name }}</div>
  <div>
    <div v-if="phase === 'DISCONNECT'">
      <button @click="handleSocketConnect">連線</button>
    </div>
    <div v-if="phase === 'WAITING'">
      <div v-if="!room.id">
        <div>
          房間名稱: <input type="text" v-model="roomName">
          <button v-if="roomName === ''" type="button" class="text-white bg-blue-400 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2 text-center mx-2 border-0" disabled>創建房間</button>
          <button v-else @click="handleCreateRoom" type="button" class="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2 text-center mx-2 border-0 pointer">創建房間</button>
        </div>
        <button @click="handleSearchRoom">更新房間列表</button>
        <div>選擇房間</div>
        <div class="flex gap-2 flex-warp">
          <div @click="handleJoinRoom(room)" class="text-center border-2 border-purple-200 w-150 h-150 bg-purple-100 rounded-md pointer flex flex-col justify-between" v-for="room in rooms">
            <div class="py-2">{{ room.name }}</div>
            <div v-if="room.roomStatus === 'INGAME'" class="py-2" >遊戲中</div>
            <div v-else class="py-2">人數 {{ room.seatedPlayerCount }} / {{ room.unlockedSeats }}</div>
          </div>
        </div>
      </div>
      <div v-if="room.id">
        <button v-if="room.host === user.playerId" @click="handleStartGame">開始遊戲</button>
        <div>房間id: {{room.id}}</div>
        <div>房間名稱: {{room.name}}</div>
        <div>房主: {{room.host}}</div>
        <div>玩家:</div>
        <div v-for="seat in seats" :key="seat.id">
          <div v-if="seat.playerId" class="py-1">
            <span class="mr-2">探險者: {{seat.playerId}}</span>
            <span v-if="seat.state === 'NOTREADY'" class="bg-red-100 py-1 px-2 rounded-md" >準備中</span>
            <span v-if="seat.state === 'READY'" class="bg-green-100 py-1 px-2 rounded-md">已準備好</span>
          </div>
        </div>
        <div class="py-1" v-if="roomPlayersCount < room.unlockedSeats">
          <span>等待探險者加入...</span>
        </div>
        <button @click="handleReady">已準備好</button>
        <button @click="handleExitRoom">離開房間</button>
      </div>
    </div>
    <div v-if="phase === 'PLAYING'" >
      <div>遊戲進度: Round {{ game.round }} Turn {{game.turn}}</div>
      <div>通道
        <span v-for="tunnel in game.tunnel">
          <span>{{ tunnel.card }}</span> | 
        </span>
      </div>
      <div>探索者: 
        <div v-for="explorer in game.explorers">
          <span>{{ explorer.explorerId }}</span>
          <span v-if="explorer.inTent">已放棄</span>
          <span v-else-if="explorer.choice === 'Selected'">已選擇</span>
          <span v-else>考慮中...</span>
        </div>
      </div>
      <div v-if="canChoise">
        <button @click="()=>handleChoice('keepGoing')">繼續探索</button>
        <button @click="()=>handleChoice('quit')">放棄</button>
      </div>
    </div>
    <div v-if="phase === 'END'">
      <div>遊戲結束</div>
      <div>勝利者: {{ winner }}</div>
      <div>分數</div>
      <div v-for="score in endScores">
        <span>{{ score.id }}獲得分數:{{ score.totalPoints }}</span>
      </div>
    </div>
    <!-- <button @click="handleMessage">傳訊息</button> -->
    <!-- <button @click="handleReady">已準備好</button> -->
  </div>
</template>
<style scoped>
.flex {
  display: flex;
}
.gap-2 {
  gap: 8px;
}
.w-150 {
  width: 150px;
}
.h-150 {
  height: 80px;
}
.flex-warp {
  flex-wrap: wrap;
}
.text-center {
  text-align: center;
}
.border-2 {
  border-width: 2px;
}
.bg-purple-100 {
background-color: rgb(243 232 255)
}
.bg-red-100 {
  background-color: rgb(254 226 226)
}
.bg-green-100 {
  background-color: rgb(220 252 231)
}
.border-purple-200 {
  border-color: rgb(243 232 255)
}
.rounded-md {
  border-radius: 8px;
}
.pointer {
  cursor: pointer;
}
.flex-col {
  flex-direction: column;
}
.justify-between {
  justify-content: space-between;
}
.py-1 {
  padding: 4px 0;
}
.px-2 {
  padding: 0 8px;
}
.mr-2 {
  margin-right: 8px;
}
.text-white {
  color: #fff;
}
.bg-blue-400 {
  background-color: rgb(96 165 250)
}
.bg-blue-600 {
  background-color: rgb(37 99 235)
}
.hover\:bg-blue-800:hover {
    --tw-bg-opacity: 1;
    background-color: rgb(30 64 175 / var(--tw-bg-opacity));
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.font-medium {
  font-weight: 500;
}
.rounded-lg {
  border-radius: 8px;
}
.text-sm {
  font-size: 14px;
  line-height: 20px;
}
.px-5 {
  padding-left: 20px;
  padding-right: 20px;
}
.py-2 {
  padding-top: 0.5rem/* 8px */;
  padding-bottom: 0.5rem/* 8px */;
}
.mx-2 {
  margin-left: 8px;
  margin-right: 8px;
}
.border-0 {
  border-width: 0px;
}
</style>