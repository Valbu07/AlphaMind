require ('dotenv').config();

module.exports = {
    app: {
      port: process.env.PORT || 5000 // 3puerto por defecto donde corre express
    },
    jwt:{
      secret: process.env.JWT_SECRET || 'Secreta_muy_Secreta'
    },
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'dayana0702',
      database: process.env.MYSQL_DATABASE || 'alphamind'

    }
}