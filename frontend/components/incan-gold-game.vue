<script setup>
	import { take, takeLast } from "ramda";

	const player = ref([
		{
			name: "frohman",
			avatar: "/player1.png",
			host: true,
			bagScore: 10,
			tentScore: 98,
			playerIsReady: 1,
		},
		{
			name: "Gina",
			avatar: "/player2.png",
			bagScore: 1,
			tentScore: 10,
			playerIsReady: 1,
		},
		{
			name: "Peggy",
			avatar: "/player3.png",
			bagScore: 13,
			tentScore: 1,
			playerIsReady: 0,
		},
		{
			name: "frohman",
			avatar: "/player1.png",
			host: false,
			bagScore: 10,
			tentScore: 98,
			playerIsReady: 0,
		},
		{
			name: "Gina",
			avatar: "/player2.png",
			bagScore: 12,
			tentScore: 10,
			playerIsReady: 1,
		},
		{
			name: "Gina",
			avatar: "/player2.png",
			bagScore: 12,
			tentScore: 10,
			playerIsReady: 1,
		},
		{},
		{},
	]);

	const fistPartsOfPlayer = computed(() => {
		return take(4, player.value);
	});

	const otherPartsOfPlayer = computed(() => {
		return takeLast(4, player.value);
	});
</script>

<template>
	<div class="incan-gold-game">
		<div class="incan-gold-game__nav">
			房間名稱
			<div class="incan-gold-game__control-group">
				<button class="incan-gold-game__icon-button">
					<img src="/help.png" alt="help" />
				</button>
				<button class="incan-gold-game__icon-button">
					<img src="/setting.png" alt="setting" />
				</button>
			</div>
		</div>
		<div class="incan-gold-game__top">
			<div><decks /></div>
			<div><tunnel /></div>
			<div><temple /></div>
		</div>
		<div class="incan-gold-game__main">
			<div class="incan-gold-game__avatars">
				<template
					v-for="(player, indexOfPlayer) in fistPartsOfPlayer"
					:key="indexOfPlayer">
					<game-avatar :user="player" />
				</template>
			</div>
			<div>
				<game-scene />
				<div>
					<game-chat />
					<game-bulletin />
				</div>
			</div>
			<div class="incan-gold-game__avatars">
				<template
					v-for="(player, indexOfPlayer) in otherPartsOfPlayer"
					:key="indexOfPlayer">
					<game-avatar :user="player" />
				</template>
			</div>
		</div>
	</div>
</template>

<style>
	.incan-gold-game {
		width: 1440px;
		height: 1080px;
		padding: 6px 20px 16px;
		margin: 12px;
		background-color: #0e0a31;
		border-radius: 10px;
	}

	.incan-gold-game__nav {
		width: 100%;
		height: 56px;
		margin-bottom: 10px;
		position: relative;
		text-align: center;
		font-size: 24px;
		line-height: 56px;
		font-weight: 400px;
		color: #fff;
	}

	.incan-gold-game__control-group {
		position: absolute;
		height: 100%;
		top: 0px;
		right: 0px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.incan-gold-game__control-group > *:not(:last-child) {
		margin-right: 12px;
	}

	.incan-gold-game__icon-button {
		width: 27px;
		height: 27px;
		padding: 0;
		background-color: transparent;
		border: none;
		outline: none;
		cursor: pointer;
	}

	.incan-gold-game__icon-button img {
		width: 27px;
		height: 27px;
		object-fit: contain;
		object-position: center;
	}

	.incan-gold-game__top {
		padding: 10px 11px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background: rgba(132, 132, 132, 0.2);
		box-sizing: border-box;
		margin-bottom: 20px;
	}

	.incan-gold-game__main {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}

	.incan-gold-game__main > div:nth-child(2) {
		display: flex;
		flex-direction: column;
	}

	.incan-gold-game__main > div:nth-child(2) > div:nth-child(1) {
		margin-bottom: 10px;
	}

	.incan-gold-game__main > div:nth-child(2) > div:nth-child(2) {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.incan-gold-game__avatars {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
