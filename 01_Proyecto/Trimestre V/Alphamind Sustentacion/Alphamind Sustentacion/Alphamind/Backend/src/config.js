require ('dotenv').config();

module.exports = {
    app: {
      port: process.env.PORT || 3306 // 3puerto por defecto
    },
    jwt:{
      secret: process.env.JET_SECRET || 'Secreta_muy_Secreta'
    },
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '9635170',
      database: process.env.MYSQL_DATABASE || 'alphamind'

    }
}