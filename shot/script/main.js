// ゲーム設定
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 自機の設定
const shipWidth = 30;
const shipHeight = 30;
let shipX = canvas.width / 2 - shipWidth / 2;
const shipY = canvas.height - shipHeight - 10;

// 自機の情報を格納
let ship = { x: shipX, y: shipY, width: shipWidth, height: shipHeight, dx: 0 };

// 配列：発射された弾丸の情報を格納
let bullets = [];

// キー設定

// keyDownHandler, keyUpHandler: キーボードの左右キーを押した時と離した時の自機の動きを制御。

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        ship.dx = 5;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        ship.dx = -5;
    }
}

document.addEventListener("keydown", (e) => {
    keyDownHandler(e);
});

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
        ship.dx = 0;
    }
}

document.addEventListener("keyup", (e) => {
    keyUpHandler(e);
});

// keyPressHandler: スペースキーを押した時に弾丸を発射。
function keyPressHandler(e) {
    if (e.key === "" || e.key === " " || e.key === "Spacebar") {
        bullets.push({
            x: ship.x + ship.width / 2 - 2.5, y: ship.y, width: 5, height: 10, dy: -5
        });
    }
}

document.addEventListener("keydown", (e) => {
    console.log("Pressed key:", e.key);
    keyPressHandler(e);
});

// enemies 配列: 出現する敵の情報を格納。
let enemies = [];

// score 変数: ゲームのスコアを保持。
let score = 0;


// drawEnemies: 敵を描画し、画面下部に到達したら削除。
function drawEnemies() {
    ctx.fillStyle = "#00FF00";
    enemies.forEach((enemy, index) => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemy.dy;

        // 敵が画面下部に到達
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1); // 敵を削除
            lives--; // ライフポイントを1減らす

            // ライフポイントが0になったらゲームオーバー
            if (lives <= 0) {
                alert("Game Over");
                document.location.reload(); // ゲームをリロード
            }
        }
    });
}

// createEnemies: ランダムに敵を出現させる。
function createEnemies() {
    if (Math.random() < 0.02) { // ランダムで敵を生成
        let enemyX = Math.random() * (canvas.width - 30); // X座標をランダムに
        let enemySpeed = Math.random() * 2 + 1; // 1～3の範囲でランダムな速度を設定
        enemies.push({ 
            x: enemyX, 
            y: 0, 
            width: 30, 
            height: 30, 
            dy: enemySpeed // ランダムな速度を代入
        });
    }
}

// detectCollisions: 弾丸と敵の当たり判定を行い、当たった場合は両方を削除。
function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score++;
            }
        });
    });
}

// drawLives: ライフポイントを描画
let lives = 5; // ライフポイントの初期値

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`Lives: ${lives}`, 10, 20); // 画面左上に描画
}


// drawShip: 自機を描画。
function drawShip() {
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

// drawBullets: 弾丸を描画し、画面上部に到達したら削除。
function drawBullets() {
    ctx.fillStyle = "#FF0000";
    bullets.forEach((bullet, index) => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y += bullet.dy;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// drawScore: スコアの描画
function drawScore() {
    ctx.font = "16px Arial"; // フォントサイズとスタイルを設定
    ctx.fillStyle = "#000"; // 色を黒に設定
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 20); // スコアを右上に表示
}

// update: ゲームループ – 画面をクリアし、各要素の更新と描画を行い、自身を繰り返し呼び出すことでアニメーションを実現。
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ship.x += ship.dx;
    if (ship.x < 0) ship.x = 0;
    if (ship.x + ship.width > canvas.width) ship.x = canvas.width - ship.width;

    drawShip();
    drawBullets();
    drawEnemies();
    createEnemies();
    detectCollisions();
    drawScore(); // スコアを描画
    drawLives(); // ライフポイントを描画

    requestAnimationFrame(update);
}

// ゲーム開始
document.addEventListener("DOMContentLoaded", (event) => {
    update();
});