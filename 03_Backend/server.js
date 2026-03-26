const http = require('http');
const app = require('./src/app');          
const { initSocket } = require('./src/utils/sockets');

const server = http.createServer(app);


initSocket(server);

const PORT = app.get('port') || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

