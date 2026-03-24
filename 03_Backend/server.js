const http = require('http');
const app = require('./src/app');          
const { initSocket } = require('./src/utils/sockets');

const server = http.createServer(app);


initSocket(server);

const PORT = app.get('port') || 3000;

server.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` Swagger en http://localhost:${PORT}/api-docs`);
});