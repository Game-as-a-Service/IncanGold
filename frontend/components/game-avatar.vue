<!-- <template>
	<div :class="['game-avatar', { 'game-avatar__empty': emptyPlayer }]">
		<div class="avatar">
			<img
				v-if="!round && inTunnel"
				:src="emptyPlayer ? '../public/game-avatar__empty.png' : 'playerAvatar'"
				:alt="avatar" />
			<div v-else class="avatar-empty">
				<img src="" alt="" />
				<p>0</p>
			</div>
			<div class="name">
				<p>{{ playerName }}</p>
			</div>
			<div class="tent-score">{{ tentScore }}</div>
		</div>

		<div
			v-if="!playerIsHost && !emptyPlayer"
			:class="[
				'game-avatar__status',
				{ 'game-avatar__status--ready': playerIsReady },
			]"></div>
		<div v-if="playerIsHost" class="playerIsHost">
			<p>房主</p>
		</div>
	</div>
</template> -->

版型
<template>
	<div class="game-avatar">
		<div class="avatar">
			<img src="../public/avatar1.png" alt="avatar" />
			<div class="avatar-empty">
				<img src="" alt="" />
				<p>0</p>
			</div>
			<div class="name">
				<p>player name</p>
			</div>
			<div class="total-score">0</div>
		</div>

		<div class="game-avatar__status game-avatar__status--ready"></div>

		<div class="playerIsHost">
			<p>房主</p>
		</div>
	</div>
</template>

<script setup>
	import { compose, defaultTo, isEmpty, isNil, path } from "ramda";

	const props = defineProps({
		user: {
			type: Object,
			default: () => ({}),
		},
	});

	const { user } = toRefs(props);

	const emptyPlayer = computed(() => {
		return isNil(user.value) || isEmpty(user.value);
	});

	const playerIsHost = computed(() => {
		return path(["host"], user.value);
	});
	// const playerIsHost = true;

	const playerName = computed(() => {
		return path(["name"], user.value);
	});

	const playerAvatar = computed(() => {
		return compose(defaultTo("./player.png"), path(["avatar"]))(user.value);
	});

	const playerIsReady = computed(() => {
		return path(["avatar"], user.value) === "ready";
	});
</script>

<style>
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	.game-avatar {
		width: 158px;
		border-radius: 1.25rem;
		background-color: rgba(228, 228, 228, 0.4);
		position: relative;
		margin-bottom: 10px;
		overflow: hidden;
	}

	.game-avatar:last-child {
		margin-bottom: 0;
	}

	.avatar {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-left: 23px;
		padding: 20px 20px 10px 6px;
	}

	.game-avatar img {
		width: 118px;
		height: 118px;
		border: 1px solid #939393;
		border-radius: 100px;
		margin-bottom: 12px;
	}

	.game-avatar p {
		font-size: 18px;
		color: #fff;
		margin: 0;
	}

	/* 遊戲進行中 */
	.avatar-empty {
		position: relative;
	}

	.avatar-empty img {
		background-color: #d9d9d9;
	}

	.avatar-empty p {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -55%);
		font-size: 66px;
		color: #7b7b7b;
	}

	.game-avatar__status {
		position: absolute;
		width: 17px;
		height: 183px;
		background-color: #bebdbd;
		top: 0;
		left: 0;
	}

	.game-avatar__status--ready {
		background-color: rgba(44, 220, 0, 0.65);
	}

	/* 無玩家 */
	.game-avatar__empty {
		background-color: transparent;
	}

	.game-avatar__empty .game-avatar__status--ready {
		background: transparent;
	}

	.game-avatar__empty img {
		border: none;
	}

	/* 房主標示' */
	.playerIsHost {
		position: absolute;
		top: 12px;
		right: 0;
		background-color: rgba(47, 47, 47, 0.7);
		padding: 0 12px 0 10px;
		border-radius: 10px 0 0 10px;
	}

	/* turn 分數 */

	/* tent-score 分數 */
	.tent-score {
		width: 40px;
		height: 40px;
		position: absolute;
		top: 100px;
		right: 3px;

		font-size: 25px;
		font-weight: 700;
		color: #bf0000;
		text-align: center;
		line-height: 38px;

		background-color: #fff;
		border: 2px solid #7b7b7b;
		border-radius: 100px;
	}
</style>
