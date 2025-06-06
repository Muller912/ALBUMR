const janijimNombres = [
    "Alex", "Khanis", "Milo", "Yoni", "Aby", "Alma", "Cata", "Dan", "Dani.K", "Ivo",
    "Jaz", "Juli", "Lolo", "Mateo", "Nacho", "Paula", "Ramiro", "Schniper", "Yair",
    "Siano", "Sophie", "Tiago", "Wais", "Toto", "Uri", "Widder", "Wolko", "Benja",
    "Dani.M", "Emma", "Espe", "Maayan", "Sharon", "Sofia.K", "Tali", "Ari"
  ];
  
  const madrijimNombres = [
    "Iara.F", "Diego", "Rossman", "Vicky", "Igal", "Iara.N"
  ];
  
  const leyendasNombres = [
    "Puachi", "Mile", "Chiara", "Adri", "Cande", "Maia", "Guido", "Thiago.R"
  ];
  
  // Construcción de array total de figuritas
  const totalFiguritas = [];
  
  let idCounter = 1;
  
  janijimNombres.forEach(nombre => {
    totalFiguritas.push({
      id: idCounter++,
      nombre,
      tipo: "janij",
      imagen: `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(nombre)}`
    });
  });
  
  madrijimNombres.forEach(nombre => {
    totalFiguritas.push({
      id: idCounter++,
      nombre,
      tipo: "madrij",
      imagen: `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${encodeURIComponent(nombre)}`
    });
  });
  
  leyendasNombres.forEach(nombre => {
    totalFiguritas.push({
      id: idCounter++,
      nombre,
      tipo: "leyenda",
      imagen: `https://api.dicebear.com/8.x/identicon/svg?seed=${encodeURIComponent(nombre)}`
    });
  });
  
  // Elementos DOM
  const albumDiv = document.getElementById("album");
  const sobreDiv = document.getElementById("sobre-abierto");
  const abrirBtn = document.getElementById("abrir-sobre");
  const timerDiv = document.getElementById("timer");
  const imgSobreBloqueado = document.getElementById("sobre-bloqueado-img");
  
  let coleccion = JSON.parse(localStorage.getItem("coleccion_rochel")) || [];
  let cooldown = false;
  
  function renderAlbum() {
    albumDiv.innerHTML = "";
  
    // Ordenar por tipo y nombre: janij, madrij, leyenda
    const ordenado = totalFiguritas.slice().sort((a, b) => {
      if (a.tipo === b.tipo) {
        return a.nombre.localeCompare(b.nombre);
      }
      if (a.tipo === "leyenda") return 1;
      if (b.tipo === "leyenda") return -1;
      if (a.tipo === "madrij" && b.tipo === "janij") return 1;
      if (a.tipo === "janij" && b.tipo === "madrij") return -1;
      return 0;
    });
  
    ordenado.forEach(fig => {
      const pegada = coleccion.includes(fig.id);
      const div = document.createElement("div");
      div.className = `figurita ${pegada ? "" : "faltante"}`;
  
      if (pegada) {
        div.innerHTML = `
          <img src="${fig.imagen}" alt="${fig.nombre}">
          <p>${fig.nombre}</p>
          <small class="tipo ${fig.tipo}">${fig.tipo}</small>
        `;
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
    const disponibles = totalFiguritas.filter(f => !coleccion.includes(f.id));
  
    while (nuevas.length < 5 && disponibles.length > 0) {
      const randIndex = Math.floor(Math.random() * disponibles.length);
      nuevas.push(disponibles[randIndex]);
      disponibles.splice(randIndex, 1);
    }
  
    // Completar con repetidas si ya las tiene todas
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
  