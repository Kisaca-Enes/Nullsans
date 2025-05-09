const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const soul = {
  x: 300,
  y: 400,
  width: 20,
  height: 20,
  color: "red",
  speed: 5,
  hp: 100,
  isBlueHeartActive: false,
  touchStartX: 0,
  touchStartY: 0,
  isTouching: false
};

const groundHeight = 40;
const keys = {};
let bones = [];
let lasers = [];

const dialogues = [
  "Try forever",
  "the judgment you understand. I don't have any in mind.",
  "You think it's finally over?",
  "You woke up in your eternal hell",
  "In the end, you killed everyone.",
  "you can't win in this cycle",
  "Our battle is in this endless cycle",
  "Until your determination ends",
  "You'll be shattered.",
  "I am made of determination",
  "determination",
  "determination",
  "and stronger than you",
  "determination",
  "determination",
  "determination",
  "and stronger than you"
  
];

let dialogueIndex = 0;

function updateDialogue() {
  const dialogueBox = document.getElementById("dialogue");
  dialogueBox.textContent = dialogues[dialogueIndex];
  dialogueIndex = (dialogueIndex + 1) % dialogues.length;
}
setInterval(updateDialogue, 3000);
updateDialogue();

// Kalp rengini ve özelliğini değiştirme (şans sistemi)
function updateHeartType() {
  const isBlue = Math.random() < 0.4;
  soul.isBlueHeartActive = isBlue;
  soul.color = isBlue ? "blue" : "red";
}
setInterval(updateHeartType, 30000);
updateHeartType();

// Kemik ve ışın yaratma
function spawnBone() {
  // Kemikler
  for (let i = 0; i < 10; i++) {
    bones.push({
      x: Math.random() < 0.5 ? 0 : canvas.width - 10,
      y: Math.random() * canvas.height,
      width: 10,
      height: 40,
      speed: 3 + Math.random() * 2,
      direction: Math.random() < 0.5 ? 1 : -1
    });
  }

  for (let i = 0; i < 10; i++) {
    bones.push({
      x: Math.random() * (canvas.width - 10),
      y: canvas.height,
      width: 10,
      height: 40,
      speed: 3 + Math.random() * 2,
    });
  }

  // Dikey ışın
  lasers.push({
    x: Math.random() * (canvas.width - 10),
    y: Math.random() * (canvas.height - 100) + 100,
    width: 5,
    height: 50,
    speed: 5 + Math.random() * 5,
    dx: 0,
    dy: -1
  });

  // Çapraz ışın (bonus)
  lasers.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: 5,
    height: 50,
    speed: 4 + Math.random() * 7,
    dx: Math.random() < 0.5 ? -1 : 1,
    dy: -1
  });
}

// Ses efekti ekleme
const boneSound = new Audio('bone-hit-sound.mp3');  // Kemik sesini burada ekle

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Fight butonunu oluştur
const fightButton = document.createElement("button");
fightButton.textContent = "Fight";
fightButton.style.position = "absolute";
fightButton.style.top = "50%";
fightButton.style.left = "50%";
fightButton.style.transform = "translate(-50%, -50%)";
fightButton.style.fontSize = "24px";
fightButton.style.padding = "10px 20px";
fightButton.style.display = "none"; // Başlangıçta gizle

document.body.appendChild(fightButton);

// Fight butonuna tıklanınca yönlendirme yap
fightButton.addEventListener("click", () => {
  window.location.href = "kazanma.html"; // Kazanma sayfasına yönlendir
});

// 2 dakika sonra Fight butonunu göster
setTimeout(() => {
  fightButton.style.display = "block"; // Butonu görünür yap
},120000); // 2 dakika (120000 ms)

// Güncelleme
function update() {
  if (soul.hp <= 0) {
    alert("You died... Try again?");
    location.reload();
  }

  if (soul.isBlueHeartActive) {
    soul.y = canvas.height - groundHeight - soul.height;
    if (keys["ArrowLeft"] && soul.x > 0) soul.x -= soul.speed;
    if (keys["ArrowRight"] && soul.x + soul.width < canvas.width) soul.x += soul.speed;
  } else {
    if (keys["ArrowLeft"] && soul.x > 0) soul.x -= soul.speed;
    if (keys["ArrowRight"] && soul.x + soul.width < canvas.width) soul.x += soul.speed;
    if (keys["ArrowUp"] && soul.y > 0) soul.y -= soul.speed;
    if (keys["ArrowDown"] && soul.y + soul.height < canvas.height) soul.y += soul.speed;
  }

  for (let bone of bones) {
    if (bone.direction === 1) {
      bone.x += bone.speed;
    } else {
      bone.x -= bone.speed;
    }
    bone.y += bone.speed;

    if (
      soul.x < bone.x + bone.width &&
      soul.x + soul.width > bone.x &&
      soul.y < bone.y + bone.height &&
      soul.y + soul.height > bone.y
    ) {
      soul.hp -= 1;
      boneSound.play();  // Kemik çarptığında ses efekti
    }
  }

  for (let laser of lasers) {
    laser.x += laser.dx * laser.speed;
    laser.y += laser.dy * laser.speed;
    if (
      soul.x < laser.x + laser.width &&
      soul.x + soul.width > laser.x &&
      soul.y < laser.y + laser.height &&
      soul.y + soul.height > laser.y
    ) {
      soul.hp -= 2;
    }
  }

  bones = bones.filter((b) => b.y + b.height > 0 && b.x + b.width > 0 && b.x < canvas.width);
  lasers = lasers.filter((l) => l.y + l.height > 0 && l.x + l.width > 0 && l.x < canvas.width);
}

function specialAttackFrom(direction) {
  const count = 15;
  for (let i = 0; i < count; i++) {
    let bone = {
      width: 10,
      height: 40,
      speed: 7,
      x: 0,
      y: 0
    };

    if (direction === "top") {
      bone.x = (canvas.width / count) * i;
      bone.y = -bone.height;
      bone.direction = "down";
    } else if (direction === "bottom") {
      bone.x = (canvas.width / count) * i;
      bone.y = canvas.height;
      bone.direction = "up";
    } else if (direction === "left") {
      bone.x = -bone.width;
      bone.y = (canvas.height / count) * i;
      bone.direction = "right";
    } else if (direction === "right") {
      bone.x = canvas.width;
      bone.y = (canvas.height / count) * i;
      bone.direction = "left";
    }

    bone.special = true;
    bones.push(bone);
  }
}

function updateSpecialBones() {
  for (let bone of bones) {
    if (!bone.special) continue;

    switch (bone.direction) {
      case "down":
        bone.y += bone.speed;
        break;
      case "up":
        bone.y -= bone.speed;
        break;
      case "left":
        bone.x -= bone.speed;
        break;
      case "right":
        bone.x += bone.speed;
        break;
    }
  }
}
updateSpecialBones();
setTimeout(() => {
  specialAttackFrom("right");
  setTimeout(() => specialAttackFrom("top"), 1000);
  setTimeout(() => specialAttackFrom("bottom"), 2000);
  setTimeout(() => specialAttackFrom("left"), 3000);
}, 6000); // 1 dakika sonra başlar

function drawSoul() {
  ctx.fillStyle = soul.color;
  ctx.fillRect(soul.x, soul.y, soul.width, soul.height);
}

function drawBones() {
  ctx.fillStyle = "white";
  for (let bone of bones) {
    ctx.fillRect(bone.x, bone.y, bone.width, bone.height);
  }
}

function drawLasers() {
  ctx.fillStyle = "cyan";
  for (let laser of lasers) {
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
  }
}

function drawHP() {
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText("HP: " + soul.hp, 10, 30);
}

function drawGround() {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);
}

function gameLoop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  update();
  drawSoul();
  drawBones();
  drawLasers();
  drawGround();
  drawHP();

  requestAnimationFrame(gameLoop);
}

setInterval(spawnBone, 1000);
gameLoop();

// Mobil cihazlarda dokunma hareketlerini işlemek için
canvas.addEventListener("touchstart", (e) => {
  soul.touchStartX = e.touches[0].clientX;
  soul.touchStartY = e.touches[0].clientY;
  soul.isTouching = true;
});

canvas.addEventListener("touchmove", (e) => {
  if (!soul.isTouching) return;
  const touchEndX = e.touches[0].clientX;
  const touchEndY = e.touches[0].clientY;

  const deltaX = touchEndX - soul.touchStartX;
  const deltaY = touchEndY - soul.touchStartY;

  soul.x += deltaX / 2;
  soul.y += deltaY / 2;

  soul.touchStartX = touchEndX;
  soul.touchStartY = touchEndY;
});

canvas.addEventListener("touchend", () => {
  soul.isTouching = false;
});
