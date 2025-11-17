

const success = (req, res, data, status = 200) => {
    res.status(status).json({
        error: false,
        status: status,
        body: data
    });
};

const error = (req, res, mensaje = 'Error interno del servidor', status = 500) => {
    res.status(status).json({
        error: true,
        status: status,
        body: mensaje
    });
};

module.exports = { success, error };