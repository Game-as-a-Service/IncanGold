<script setup></script>

<template>
	<div class="game-scene font-cubic">
		<div class="game-title">
			<p class="font-ch" data-stroke="印加寶藏">印加寶藏</p>
			<p class="font-en" data-stroke="INCAN GOLD">INCAN GOLD</p>
		</div>
		<div class="game-btns">
			<button type="button" class="btn-ready">準備</button>
		</div>
	</div>
</template>

<style>
	.game-scene {
		width: 1024px;
		height: 476px;
		/* background-size: contain;
	 background-position: center; */
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
			url("./machu-picchu.png") center/contain;
		/* background-image: url('./machu-picchu.png'); */
		border-radius: 20px;
	}

	.game-title {
		position: relative;
		padding: 47px 56px 58px 75px;
	}

	.font-ch {
		position: relative;
		margin: 0;
		z-index: 10;
		font-size: 128px;
		line-height: 150px;
		letter-spacing: 0.27em;
	}

	.font-ch::before,
	.font-en::before {
		content: attr(data-stroke);
		position: absolute;
		z-index: -1;
		-webkit-text-stroke: 8px rgba(255, 199, 0, 1);
	}

	.font-en {
		position: absolute;
		margin: 0;
		top: 159px;
		left: 425px;
		font-size: 90px;
		line-height: 105px;
		z-index: 9;
		color: #fff;
	}

	.game-btns {
		text-align: center;
		margin-top: 58px;
	}

	.btn-ready {
		width: 203px;
		padding: 16px 0;
		font-size: 38px;
		background: center / cover no-repeat url("/ready.png");
	}
</style>
