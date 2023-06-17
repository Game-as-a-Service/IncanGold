<script setup>
	import take from "ramda/es/take";
	import takeLast from "ramda/es/takeLast";

	const player = ref([{}, {}, {}, {}, {}, {}, {}, {}]);

	const fistPartsOfPlayer = computed(() => {
		return take(4, player.value);
	});

	const otherPartsOfPlayer = computed(() => {
		return takeLast(4, player.value);
	});
</script>

<template>
	<div class="incan-gold-game">
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
				<game-sceen />
			</div>
			<div class="incan-gold-game__avatars">
				<template
					v-for="(player, indexOfPlayer) in fistPartsOfPlayer"
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
		background-color: #0e0a31;
		background-image: linear-gradient(
			rgba(248, 248, 248, 0.11),
			rgba(248, 248, 248, 0.11)
		);
		margin: 0 auto;
	}

	.incan-gold-game__top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.incan-gold-game__main {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}

	.incan-gold-game__avatars {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin: 10px;
	}
</style>
