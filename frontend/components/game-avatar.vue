<template>
  <div class="game-avatar">
    <img src="" alt="">
    <p>player name</p>
  </div>
</template>

<style>
.game-avatar {
  width: 118px;
  height: 118px;
  border-radius: 99rem;
  background-color: gray;
  position: relative;
}

.game-avatar p {
  position: absolute;
  font-size: 16px;
  width: 100%;
  left: 50%;
  bottom: -16px;
  transform: translateX(-50%);
  text-align: center;
  margin: 0px;
}
</style>