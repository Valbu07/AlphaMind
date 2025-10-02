const app = require ('./app');

app.listen(app.get('port'), () => {
    console.log('servidor en el puerto: ' , app.get('port') );
});