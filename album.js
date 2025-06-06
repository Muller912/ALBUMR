const totalFiguritas = [];

for (let i = 1; i <= 40; i++) {
  totalFiguritas.push({
    id: i,
    nombre: `Janij ${i}`,
    tipo: "janij",
    imagen: `https://api.dicebear.com/8.x/adventurer/svg?seed=Janij${i}`
  });
}

for (let i = 41; i <= 50; i++) {
  totalFiguritas.push({
    id: i,
    nombre: `Madrij ${i - 40}`,
    tipo: "madrij",
    imagen: `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=Madrij${i - 40}`
  });
}

const albumDiv = document.getElementById("album");
const sobreDiv = document.getElementById("sobre-abierto");
const abrirBtn = document.getElementById("abrir-sobre");
const timerDiv = document.getElementById("timer");
const imgSobreBloqueado = document.getElementById("sobre-bloqueado-img");

let coleccion = JSON.parse(localStorage.getItem("coleccion_rochel")) || [];
let cooldown = false;

function renderAlbum() {
  albumDiv.innerHTML = "";
  totalFiguritas.forEach(fig => {
    const pegada = coleccion.includes(fig.id);
    const div = document.createElement("div");
    div.className = `figurita ${pegada ? "" : "faltante"}`;

    if (pegada) {
      div.innerHTML = `<img src="${fig.imagen}" alt="${fig.nombre}"><p>${fig.nombre}</p>`;
    } else {
      div.innerHTML = `<div class="placeholder">?</div>`;
    }

    albumDiv.appendChild(div);
  });
}

function abrirSobre() {
  if (cooldown) return;
  cooldown = true;
  abrirBtn.disabled = true;

  const nuevas = [];
  while (nuevas.length < 5) {
    const rand = totalFiguritas[Math.floor(Math.random() * totalFiguritas.length)];
    nuevas.push(rand);
  }

  sobreDiv.innerHTML = "";
  nuevas.forEach(fig => {
    const mini = document.createElement("div");
    mini.className = "figurita";
    mini.style.transform = "scale(0.5) rotate(-10deg)";
    mini.innerHTML = `<img src="${fig.imagen}" alt="${fig.nombre}"><p>${fig.nombre}</p>`;
    sobreDiv.appendChild(mini);

    setTimeout(() => {
      mini.style.transition = "transform 0.5s ease";
      mini.style.transform = "scale(1) rotate(0deg)";
    }, 100);

    if (!coleccion.includes(fig.id)) {
      coleccion.push(fig.id);
    }
  });

  localStorage.setItem("coleccion_rochel", JSON.stringify(coleccion));
  renderAlbum();
  iniciarCooldown();
}

function iniciarCooldown() {
  let tiempo = 20;
  timerDiv.style.display = "block";
  imgSobreBloqueado.style.display = "inline-block";
  timerDiv.textContent = `Siguiente sobre en ${tiempo}s`;

  const intervalo = setInterval(() => {
    tiempo--;
    timerDiv.textContent = `Siguiente sobre en ${tiempo}s`;
    if (tiempo <= 0) {
      clearInterval(intervalo);
      abrirBtn.disabled = false;
      cooldown = false;
      timerDiv.style.display = "none";
      imgSobreBloqueado.style.display = "none";
    }
  }, 1000);
}

abrirBtn.addEventListener("click", abrirSobre);
renderAlbum();
