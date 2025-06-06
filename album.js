const janijimNombres = [
  "Alex", "Khanis", "Milo", "Yoni", "Aby", "Alma", "Cata", "Dan", "Dani.K", "Ivo",
  "Jaz", "Juli", "Lolo", "Mateo", "Nacho", "Paula", "Ramiro", "Schniper", "Yair",
  "Siano", "Sophie", "Tiago", "Wais", "Toto", "Uri", "Widder", "Wolko", "Benja",
  "Dani.M", "Emma", "Espe", "Maayan", "Sharon", "Sofia.K", "Tali", "Ari"
];

const madrijimNombres = ["Iara.F", "Diego", "Rossman", "Vicky"];
const mejanNombres = ["Igal", "Iara.N"];
const leyendasNombres = ["Puachi", "Mile", "Chiara", "Adri", "Cande", "Maia", "Guido", "Thiago.R"];
const grupoFotos = [
  "https://picsum.photos/300/150?random=1",
  "https://picsum.photos/300/150?random=2",
  "https://picsum.photos/300/150?random=3",
  "https://picsum.photos/300/150?random=4",
  "https://picsum.photos/300/150?random=5"
];

const totalFiguritas = [];
let idCounter = 1;

function crearFiguritas(nombres, tipo) {
  nombres.forEach(nombre => {
    totalFiguritas.push({
      id: idCounter,
      numero: idCounter,
      nombre,
      tipo,
      imagen: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${encodeURIComponent(nombre)}`
    });
    idCounter++;
  });
}

crearFiguritas(janijimNombres, "janij");
crearFiguritas(madrijimNombres, "madrij");
crearFiguritas(mejanNombres, "mejan");
crearFiguritas(leyendasNombres, "leyenda");

grupoFotos.forEach((url, i) => {
  totalFiguritas.push({
    id: idCounter,
    numero: idCounter,
    nombre: `Foto Grupo ${i + 1}`,
    tipo: "foto",
    imagen: url
  });
  idCounter++;
});

const albumDiv = document.getElementById("album");
const sobreDiv = document.getElementById("sobre-abierto");
const abrirBtn = document.getElementById("abrir-sobre");
const timerDiv = document.getElementById("timer");
const imgSobreBloqueado = document.getElementById("sobre-bloqueado-img");

let coleccion = [];
let cooldown = false;

function renderAlbum() {
  albumDiv.innerHTML = "";

  const categorias = {};

  totalFiguritas.forEach(fig => {
    if (!categorias[fig.tipo]) categorias[fig.tipo] = [];
    categorias[fig.tipo].push(fig);
  });

  const ordenCategorias = ["janij", "madrij", "mejan", "leyenda", "foto"];

  ordenCategorias.forEach(tipo => {
    if (!categorias[tipo]) return;

    const titulo = document.createElement("h3");
    const nombresTipo = {
      janij: "Janijim",
      madrij: "Madrijim",
      mejan: "Mejan",
      leyenda: "Leyendas",
      foto: "Fotos del grupo"
    };
    titulo.textContent = nombresTipo[tipo] || tipo;
    titulo.style.marginTop = "30px";
    albumDiv.appendChild(titulo);

    const contenedor = document.createElement("div");
    contenedor.style.display = "flex";
    contenedor.style.flexWrap = "wrap";
    contenedor.style.justifyContent = "center";
    contenedor.style.gap = "10px";
    albumDiv.appendChild(contenedor);

    categorias[tipo]
      .sort((a, b) => a.numero - b.numero)
      .forEach(fig => {
        const div = document.createElement("div");
        const pegada = coleccion.includes(fig.id);
        div.className = `figurita ${pegada ? "" : "faltante"}`;

        if (pegada) {
          div.innerHTML = `
            <img src="${fig.imagen}" alt="${fig.nombre}">
            <p>${fig.nombre}</p>
            <small class="tipo ${fig.tipo}">${fig.tipo}</small>
            <small class="numero">${fig.numero}</small>
          `;
        } else {
          div.innerHTML = `
            <div class="placeholder">?</div>
            <p>?</p>
            <small class="numero">${fig.numero}</small>
          `;
        }

        contenedor.appendChild(div);
      });
  });
}

function abrirSobre() {
  if (cooldown) return;
  cooldown = true;
  abrirBtn.disabled = true;

  const nuevas = [];
  const disponibles = totalFiguritas.filter(f => !coleccion.includes(f.id));

  while (nuevas.length < 5 && disponibles.length > 0) {
    const randIndex = Math.floor(Math.random() * disponibles.length);
    nuevas.push(disponibles[randIndex]);
    disponibles.splice(randIndex, 1);
  }

  while (nuevas.length < 5) {
    const rand = totalFiguritas[Math.floor(Math.random() * totalFiguritas.length)];
    nuevas.push(rand);
  }

  sobreDiv.innerHTML = "";
  nuevas.forEach(fig => {
    const mini = document.createElement("div");
    mini.className = "figurita";
    mini.style.transform = "scale(0.5) rotate(-10deg)";
    mini.innerHTML = `
      <img src="${fig.imagen}" alt="${fig.nombre}">
      <p>${fig.nombre}</p>
      <small class="tipo ${fig.tipo}">${fig.tipo}</small>
      <small class="numero">${fig.numero}</small>
    `;
    sobreDiv.appendChild(mini);

    setTimeout(() => {
      mini.style.transition = "transform 0.5s ease";
      mini.style.transform = "scale(1) rotate(0deg)";
    }, 100);

    if (!coleccion.includes(fig.id)) {
      coleccion.push(fig.id);
    }
  });

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
      cooldown = false;
      abrirBtn.disabled = false;
      timerDiv.style.display = "none";
      imgSobreBloqueado.style.display = "none";
    }
  }, 1000);
}

abrirBtn.addEventListener("click", abrirSobre);
renderAlbum();
