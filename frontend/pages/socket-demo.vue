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
const game = ref({})
const winner = ref({})
// phase = DISCONNECT WAITING, PLAYING, END
const phase = ref('DISCONNECT')
let socket
const gameId = '123456'
const playerId = 'a'
const handleSocketConnect = () => {
  const token = user.value.token
  socket = io('https://incan-gold.fly.dev/', { auth: { token } })
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
      winner.value = gameOverEvent.data.winnerID
    }
  })
}

const handleCreateRoom = () => {
  const params = {
    playerId: 'arong',
    roomName: 'test',
  }
  useFetch('http://localhost:8000/rooms', {
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
const handleJoinRoom = () => {
  const roomId = '123'
  const params = {
    playerId: user.value.playerId,
  }
  useFetch(`http://localhost:8000/rooms/${roomId}/players`, {
    method: 'POST',
    body: params
  })
}
const handleReady = () => {
  const roomId = '123'
  const params = {
    playerId: user.value.playerId,
  }
  useFetch(`http://localhost:8000/rooms/${roomId}/ready`, {
    method: 'PATCH',
    body: params
  })
}

const handleMessage = () => {
  socket.emit('message', 'hello server!')
}


const handleStartGame = () => {
  const roomId = '123'
  // const params = {
  //   playerIds: Object.values(room.value.seats).filter(seat=>seat.state === 'READY').map(seat => seat.playerId),
  // }
  useFetch(`http://localhost:8000/rooms/${roomId}/start`, {
    method: 'POST',
    // body: params
  })

}
const handleChoice = (choice) => {
  const roomId = '123'
  const params = {
    explorerId: user.value.playerId,
    choice,
  }
  useFetch(`http://localhost:8000/games/${roomId}/choice`, {
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
    <div>socket demo</div>
  </div>
  <div>
    <span>選擇身份</span>
    <select v-model="user">
      <option v-for="user in users" :key="user.playerId" :value="user">{{user.name}}</option>
    </select>
  </div>
  <div>
    <div v-if="phase === 'DISCONNECT'">
      <button @click="handleSocketConnect">連線</button>
    </div>
    <div v-if="phase === 'WAITING'">
      <button @click="handleCreateRoom">創建房間</button>
      <button @click="handleJoinRoom">加入房間</button>
      <button @click="handleReady">已準備好</button>
      <button @click="handleStartGame">開始遊戲</button>
      <div v-if="room.id">
        <div>房間id: {{room.id}}</div>
        <div>房間名稱: {{room.name}}</div>
        <div>房主: {{room.host}}</div>
        <div>玩家:</div>
        <div v-for="seat in seats" :key="seat.id">
          <span>playerId: {{seat.playerId}}</span>
          <span>狀態: {{seat.state}}</span>
        </div>
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
          <span v-else="explorer.inTent">探索中</span>
        </div> </div>
      <button @click="()=>handleChoice('keepGoing')">繼續探索</button>
      <button @click="()=>handleChoice('quit')">放棄</button>
    </div>
    <div v-if="phase === 'END'">
      <div>遊戲結束</div>
      <div>勝利者: {{ winner }}</div>
    </div>
    <button @click="handleMessage">傳訊息</button>
    <!-- <button @click="handleReady">已準備好</button> -->
  </div>
</template>
