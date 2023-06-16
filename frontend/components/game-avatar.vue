<template>
	<div class="game-avatar">
		<div class="avatar">
			<div class="img"></div>
			<div class="turn-score"></div>
			<div class="total-score"></div>
		</div>
		<p>player name</p>
		<div class="ready"></div>
	</div>
</template>

<style>
	.game-avatar {
		width: 158px;
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
