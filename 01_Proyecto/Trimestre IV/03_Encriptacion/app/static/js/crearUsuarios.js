(function() {
  var usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  var existe = usuarios.some(function(u) {
    return u.nombre === 'admi' && u.password === 'admi';
  });
  if (!existe) {
    usuarios.push({
      id: Date.now(),
      nombre: 'admi',
      correo: 'admi@cediplus.com',
      password: 'admi',
      rol: 'Administrador',
      estado: 'Activo'
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }
})();

// 1) Funciones de almacenamiento
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function guardarUsuarios(usuarios) {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// 2) CRUD de usuarios
function crearUsuario(nombre, correo, rol, password) {
  var u = obtenerUsuarios();
  u.push({
    id: Date.now(),
    nombre: nombre,
    correo: correo,
    password: password,
    rol: rol,
    estado: 'Activo'
  });
  guardarUsuarios(u);
  refrescarTodasLasVistas();
}

function actualizarUsuario(id, campos) {
  var u = obtenerUsuarios().map(function(x) {
    if (x.id === id) {
      return Object.assign({}, x, campos);
    }
    return x;
  });
  guardarUsuarios(u);
  refrescarTodasLasVistas();
}

function eliminarUsuario(id) {
  var u = obtenerUsuarios().filter(function(x) {
    return x.id !== id;
  });
  guardarUsuarios(u);
  refrescarTodasLasVistas();
}

function renderConsultar() {
  var cont = document.querySelector('#consultar .tarjetas-usuarios');
  cont.innerHTML = '';
  obtenerUsuarios().forEach(function(u) {
    var d = document.createElement('div');
    d.className = 'tarjeta';
    d.innerHTML = '<h3>' + u.nombre + '</h3>'
                + '<p>Correo: ' + u.correo + '</p>'
                + '<p>Rol: ' + u.rol + '</p>';
    cont.appendChild(d);
  });
}

function renderEliminar() {
  var tb = document.querySelector('#eliminar .tabla-usuarios tbody');
  tb.innerHTML = '';
  obtenerUsuarios().forEach(function(u) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + u.nombre + '</td>'
                 + '<td>' + u.correo + '</td>'
                 + '<td><button data-id="' + u.id + '" class="boton-eliminar">Eliminar</button></td>';
    tb.appendChild(tr);
  });
  tb.querySelectorAll('.boton-eliminar').forEach(function(b) {
    b.addEventListener('click', function() {
      eliminarUsuario(Number(this.getAttribute('data-id')));
    });
  });
}

function renderSelects() {
  var u = obtenerUsuarios();
  ['roles','contrasena','permisos'].forEach(function(sec) {
    var s = document.querySelector('#' + sec + ' select');
    s.innerHTML = '<option value="">Selecciona un usuario</option>';
    u.forEach(function(x) {
      s.innerHTML += '<option value="' + x.id + '">' + x.nombre + '</option>';
    });
  });
}

function renderEstado() {
  var ul = document.querySelector('#estado ul');
  ul.innerHTML = '';
  obtenerUsuarios().forEach(function(u) {
    var li = document.createElement('li');
    li.textContent = u.nombre + ' - Estado: ' + u.estado;
    ul.appendChild(li);
  });
}

function refrescarTodasLasVistas() {
  renderConsultar();
  renderEliminar();
  renderSelects();
  renderEstado();
}

// 3) Listeners
document.querySelector('#crear .formulario').addEventListener('submit', function(e) {
  e.preventDefault();
  crearUsuario(
    this.querySelector('input[placeholder="Nombre Completo"]').value,
    this.querySelector('input[placeholder="Correo electrónico"]').value,
    this.querySelector('input[placeholder="Rol (ej: Administrador)"]').value,
    this.querySelector('input[placeholder="Contraseña"]').value  // si añadiste el campo
  );
  this.reset();
});

document.querySelector('#roles .formulario').addEventListener('submit', function(e) {
  e.preventDefault();
  var id = Number(this.querySelector('select').value);
  var rolNuevo = this.querySelector('input').value;
  if (id && rolNuevo) actualizarUsuario(id, { rol: rolNuevo });
  this.reset();
});



document.querySelector('#permisos .formulario').addEventListener('submit', function(e) {
  e.preventDefault();
  var id = Number(this.querySelector('select').value);
  var permiso = this.querySelector('input').value;
  if (id && permiso) {
    var user = obtenerUsuarios().find(function(x) { return x.id === id; });
    actualizarUsuario(id, { rol: user.rol + ' + ' + permiso });
  }
  this.reset();
});

refrescarTodasLasVistas();