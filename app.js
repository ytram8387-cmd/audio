let userActual = null;

// =======================
// 🔐 AUTH (LOGIN / CONTROL)
// =======================
auth.onAuthStateChanged(user => {
  if (user) {
    userActual = user;

    // Si estás en index, carga audios
    if (window.location.pathname.includes("index.html")) {
      cargarAudios();
    }

  } else {
    userActual = null;

    // Si NO está logueado, lo manda a login
    if (window.location.pathname.includes("index.html")) {
      window.location.href = "login.html";
    }
  }
});

// =======================
// 🆕 REGISTRO
// =======================
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Usuario creado"))
    .catch(e => alert(e.message));
}

// =======================
// 🔑 LOGIN
// =======================
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(e => alert(e.message));
}

// =======================
// 🚪 LOGOUT
// =======================
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// =======================
// 🎧 SUBIR AUDIO + IMAGEN
// =======================
async function subirAudio() {
  const file = document.getElementById("file").files[0];
  const imagen = document.getElementById("imagen").files[0];
  const titulo = document.getElementById("titulo").value;

  if (!file) return alert("Selecciona audio");
  if (!imagen) return alert("Selecciona imagen");
  if (!titulo) return alert("Escribe título");
  if (!userActual) return alert("No estás logueado");

  try {
    // 🔴 SUBIR AUDIO
    const fdAudio = new FormData();
    fdAudio.append("file", file);
    fdAudio.append("upload_preset", "audio_preset_123");

    const resAudio = await fetch(
      "https://api.cloudinary.com/v1_1/diumur0ls/video/upload",
      { method: "POST", body: fdAudio }
    );

    const dataAudio = await resAudio.json();
    console.log("Audio:", dataAudio);

    // 🔴 SUBIR IMAGEN
    const fdImg = new FormData();
    fdImg.append("file", imagen);
    fdImg.append("upload_preset", "audio_preset_123");

    const resImg = await fetch(
      "https://api.cloudinary.com/v1_1/diumur0ls/image/upload",
      { method: "POST", body: fdImg }
    );

    const dataImg = await resImg.json();
    console.log("Imagen:", dataImg);

    // ❌ VALIDAR
    if (!dataAudio.secure_url) {
      alert("Error subiendo audio");
      return;
    }

    if (!dataImg.secure_url) {
      alert("Error subiendo imagen");
      return;
    }

    // 💾 GUARDAR
    await db.collection("audios").add({
      titulo: titulo,
      url: dataAudio.secure_url,
      imagen: dataImg.secure_url,
      uid: userActual.uid
    });

    alert("Audio subido correctamente 🎧");

    cargarAudios();

  } catch (error) {
    console.error(error);
    alert("Error general");
  }
}

// =======================
// 📥 CARGAR AUDIOS
// =======================
function cargarAudios() {
  const galeria = document.getElementById("galeria");
  if (!galeria) return; // evita error en login.html

  galeria.innerHTML = "";

  db.collection("audios").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();

      const div = document.createElement("div");

      div.innerHTML = `
        <h3>${data.titulo}</h3>
        <div class="img-container">
        <img src="${data.imagen}">
        </div>
        <audio controls src="${data.url}"></audio><br>
        <button onclick="eliminarAudio('${doc.id}')">Eliminar</button>
        <hr>
      `;

      galeria.appendChild(div);
    });
  });
}

// =======================
// 🗑️ ELIMINAR
// =======================
function eliminarAudio(id) {
  if (confirm("¿Eliminar audio?")) {
    db.collection("audios").doc(id).delete()
      .then(() => cargarAudios());
  }
}