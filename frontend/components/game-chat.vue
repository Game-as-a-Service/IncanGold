<template>
	<div class="game-chat">
		<div class="game-chat__room">
			<p>player：talk<span>01:00</span></p>
			<p>player：我今天只能玩兩場<span>01:00</span></p>
			<p>player：早安<span>01:00</span></p>
			<p>player：大家安安<span>01:00</span></p>
			<p>player：準備開始囉<span>01:00</span></p>
			<p>player：今天我一定不會在輸了<span>01:00</span></p>
			<p>player：再啦<span>01:00</span></p>
			<p>player：快開始快開始快開始<span>01:00</span></p>
			<p>player：talk<span>01:00</span></p>
			<p>player：talk<span>01:00</span></p>
		</div>
		<div class="game-chat__input">
			<input type="text" name="input-box" />
			<button type="button"></button>
		</div>
	</div>
</template>

<style>
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	.game-chat {
		width: 598px;
		background-color: rgba(132, 132, 132, 0.2);
		border-radius: 20px;
		padding: 0 10px 10px 20px;
	}

	.game-chat__room {
		width: 567px;
		height: 208px;
		overflow: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(4, 4, 4, 0.35) rgba(132, 132, 132, 0.2);
	}

	.game-chat__room p {
		width: 542px;
		font-family: "K2D Thin", sans-serif;
		font-weight: 400;
		font-size: 20px;
		line-height: 26px;
		color: rgba(255, 255, 255, 1);
		display: flex;
		justify-content: space-between;
		margin: 0;
	}

	.game-chat__room p:not(:last-child) {
		margin-bottom: 5px;
	}

	.game-chat__room span {
		font-weight: 400;
		font-size: 15px;
		color: rgba(123, 123, 123, 1);
		margin-top: 3px;
	}

	.game-chat__room::-webkit-scrollbar {
		width: 16px;
	}

	.game-chat__room::-webkit-scrollbar-track {
		background-color: rgba(132, 132, 132, 0.2);
		border-radius: 10px;
	}

	.game-chat__room::-webkit-scrollbar-thumb {
		background-color: rgba(4, 4, 4, 0.35);
		border-radius: 10px;
	}

	.game-chat__input {
		position: relative;
	}

	.game-chat__input input {
		width: 100%;
		height: 50px;
		border-radius: 10px;
		border: 1px solid black;
		background: rgba(242, 242, 242, 0.4);
		outline: none;

		color: #fff;
		padding-left: 15px;
		/* margin-top: 10px; */
	}

	.game-chat__input button {
		width: 28px;
		height: 26px;
		background: url(./vector.png) no-repeat;
		position: absolute;
		top: 50%;
		right: 0;
		transform: translate(-50%, -50%);
		border: none;
		cursor: pointer;
	}
</style>
