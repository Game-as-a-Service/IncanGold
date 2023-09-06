<template>
  <div class="components-loby-layout">
    <div class="components-loby-layout__title">
      <p class="font-cubic">印加寶藏</p>
      <p class="font-cubic">INCAN GOLD</p>
    </div>
    <div class="components-loby-layout__main">
      <slot name="frame">
        <div class="components-loby-layout__frame">
          <slot />
        </div>
      </slot>
    </div>
  </div>
</template>

<style>
.components-loby-layout {
  background-color: #0E0A31;
  box-sizing: border-box;
  min-height: 100dvh;
  padding-top: 57px;
  padding-bottom: 57px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.components-loby-layout__title {
  width: 883px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 80px;
}

.components-loby-layout__title p {
  margin: 0;
  --shadow-width: 4px;
  --shadow-color: #FFC700;
  text-shadow: calc(var(--shadow-width) * -1) var(--shadow-width) 0 var(--shadow-color),
				  var(--shadow-width) var(--shadow-width) 0 var(--shadow-color),
				  var(--shadow-width) calc(var(--shadow-width) * -1) 0 var(--shadow-color),
				  calc(var(--shadow-width) * -1) calc(var(--shadow-width) * -1) 0 var(--shadow-color);
  user-select: none;
}

.components-loby-layout__title p:first-child {
  font-size: 128px;
  font-weight: 400;
  line-height: 128px; 
  letter-spacing: 0.27em;
  text-align: left;
  color: black;
}

.components-loby-layout__title p:last-child {
  font-size: 90px;
  font-weight: 400;
  line-height: 90px; 
  letter-spacing: 0;
  text-align: left;
  text-align: right;
  color: white;
}

.components-loby-layout__frame {
  box-sizing: border-box;
  border-radius: 20px;
  margin-left: auto;
  margin-right: auto;
  border: 4px solid rgba(147, 147, 147, 1);
  background: linear-gradient(0deg, rgba(132, 132, 132, 0.2), rgba(132, 132, 132, 0.2));
}
</style>