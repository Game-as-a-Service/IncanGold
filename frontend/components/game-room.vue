<template>
    <ul class="game-room font-cubic">
        <button class="left-arrow"></button>
        <li class="game-room_name">
            <div>
                <h2>房間名稱</h2>
                <p>人數：4/8</p>
                <p>房主：player name</p>
            </div>
            <button>加入</button>
        </li>
        <li class="game-room_name">
            <div>
                <h2>房間名稱</h2>
                <p>人數：4/8</p>
                <p>房主：player name</p>
            </div>
            <button>加入</button>
        </li>
        <li class="game-room_name">
            <div>
                <h2>房間名稱</h2>
                <p>人數：4/8</p>
                <p>房主：player name</p>
            </div>
            <button>加入</button>
        </li>
        <li class="game-room_name">
            <div>
                <h2>房間名稱</h2>
                <p>人數：4/8</p>
                <p>房主：player name</p>
            </div>
            <button>加入</button>
        </li>
        <li class="game-room_name">
            <div>
                <h2>房間名稱</h2>
                <p>人數：4/8</p>
                <p>房主：player name</p>
            </div>
            <button>加入</button>
        </li>
        <li class="game-room_name">
            <div>
                <h2>房間名稱</h2>
                <p>人數：4/8</p>
                <p>房主：player name</p>
            </div>
            <button>加入</button>
        </li>
        <li class="game-room_name">
            <div>
                <h2>房間名稱</h2>
                <p>人數：4/8</p>
                <p>房主：player name</p>
            </div>
            <button>加入</button>
        </li>
        <li class="game-room_name">
            <div>
                <h2>房間名稱</h2>
                <p>人數：4/8</p>
                <p>房主：player name</p>
            </div>
            <button>加入</button>
        </li>
    </ul>
</template>

<style>
.game-room_name, .game-room_name button{
    font-family: 'Cubic_11';
    font-weight: 400;
}
.game-room{
    box-sizing: border-box;
    width: 1239px;
    height: 717px;
    padding: 56px 48px;
    border: 4px solid #939393;
    border-radius: 20px;
    background-color: rgba(132, 132, 132, 0.20);
    display: flex;
    flex-wrap: wrap;
    position: relative;
}
.left-arrow{
    width: 32px;
    height: 32px;
    background-image: url("../assets/left arrow.png");
    position: absolute;
    left: 19.5px;
    top: 20px;
    border: none;
    cursor: pointer;
}
.game-room_name{
    box-sizing: border-box;
    width: 554px;
    height: 141px;
    background-color: rgba(132, 132, 132, 0.20);
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
}
.game-room_name:not(:last-of-type){
    margin-right: 11px;
    margin-bottom: 11px;
}
.game-room_name div{
    margin-left: 24px;
    margin-top: 24px;
    margin-bottom: 21px;
    line-height: 1;
    text-align: left;
}
.game-room_name h2{
    color: #FFC700;
    font-size: 32px;
    margin: 0;
}
.game-room_name p{
    color: #FFF;
    font-size: 20px;
    margin: 0;
}
.game-room_name h2, p:not(:last-of-type){
    margin-bottom: 12px;
}
.game-room_name button{
    color: #000;
    font-size: 20px;
    background-color: #FFD15C;
    border: none;
    width: 91px;
    height: 91px;
    border-radius: 50px;
    margin-top: 25px;
    margin-right: 23px;
    margin-bottom: 25px;
    cursor: pointer;
}
</style>
