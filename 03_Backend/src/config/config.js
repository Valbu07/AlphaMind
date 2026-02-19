require ('dotenv').config();

module.exports = {
    app: {
      port: process.env.PORT || 3000 // 3puerto por defecto donde corre express
    },
    jwt:{
      secret: process.env.JWT_SECRET || 'Secreta_muy_Secreta'
    },
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3307,
      user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '1108', 
      database: process.env.MYSQL_DATABASE || 'alphamind'

    }
}