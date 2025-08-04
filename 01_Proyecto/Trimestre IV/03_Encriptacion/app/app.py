from flask import Flask, render_template, request, session, redirect, url_for, flash
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mysqldb import MySQL
import MySQLdb.cursors
import traceback

app = Flask(__name__)
app.secret_key = 'Alphamind07DDD'

# Se conecto a la base de datos
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'dayana0702'
app.config['MYSQL_DB'] = 'alphamind'

mysql = MySQL(app)
 
 #Rutas
@app.route('/')
def login():
    return render_template("Login.html")

@app.route('/recuperar')
def recuperar():
    return render_template("recuperar.html")

@app.route('/ruta/crearTareas')
def crearTareas():
    return render_template("crearTareas.html")

@app.route('/calendario')
def calendario():
    return render_template("calendario.html")

@app.route('/reportes')
def Reportes():
    return render_template("Reportes.html")

@app.route('/chat')
def chat():
    return render_template("chat.html")

# Login
@app.route('/acceso-login', methods=['GET', 'POST'])
def adminLogin():
    if request.method == 'POST':
        _cedula = request.form['txtCedula']
        _password = request.form['txtpassword']

        cur = mysql.connection.cursor()
        cur.execute(
            ''' 
            SELECT usuario.id_usuario,
                   usuario.id_rol,
                   usuario.contraseña
              FROM funcionario
              JOIN usuario 
                ON funcionario.id_usuario = usuario.id_usuario
             WHERE funcionario.num_documento = %s
            ''',
            (_cedula,)
        )
        account = cur.fetchone()
        cur.close()

        if account:
            stored_password = account[2]
            
            # Verificar si la contraseña está encriptada
            if stored_password.startswith('pbkdf2:sha256:'):
                # Si la Contraseña esta encriptada , utilizamos check_password_hash para validar
                password_valid = check_password_hash(stored_password, _password)
            else:
                # Contraseña en texto plano 
                password_valid = (stored_password == _password)
            
            if password_valid:
                session['Logueado'] = True
                session['id_usuario'] = account[0]
                session['id_rol'] = account[1]

                if session['id_rol'] == 1: #admin
                    return redirect(url_for('crearUsuarios'))
                elif session['id_rol'] == 4: #funcionario
                    return redirect(url_for('Reportes'))
                return redirect(url_for('tareas'))

        return render_template('Login.html', mensaje='Usuario o contraseña incorrectos')

@app.route('/tareas')
def tareas():
    if not session.get('Logueado'):
        return redirect(url_for('adminLogin'))
    return render_template("tareas.html")

# creacion de usuarios


@app.route('/crearUsuarios', methods=['GET', 'POST'])
def crearUsuarios():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    if request.method == 'POST':
        cedula   = request.form.get('txtCedula')
        tipo_doc = request.form.get('selTipoDoc')
        nom1     = request.form.get('txtNombre1')
        nom2     = request.form.get('txtNombre2', '')
        ape1     = request.form.get('txtApellido1')
        ape2     = request.form.get('txtApellido2', '')
        email    = request.form.get('txtEmail')
        tel      = request.form.get('txtTelefono', '')
        cargo    = request.form.get('selCargo')
        estado   = request.form.get('selEstado')
        rol_id   = request.form.get('selRol')
        pwd_raw  = request.form.get('txtpassword')

        try:
            # en este paso, encriptamos la contraseña
            pwd_hash = generate_password_hash(pwd_raw, method='pbkdf2:sha256')

            # insertamos los datos
            cur.execute(
                '''INSERT INTO usuario (contraseña, id_rol, id_estado)
                   VALUES (%s, %s, %s)''',
                (pwd_hash, rol_id, estado)
            )
            user_id = cur.lastrowid

            cur.execute(
                '''INSERT INTO funcionario
                     (num_documento, primer_nombre, segundo_nombre,
                      primer_apellido, segundo_apellido,
                      correo_electronico, numero_telefonico,
                      id_usuario, cod_tipo_doc, codigo_cargo)
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)''',
                (cedula, nom1, nom2, ape1, ape2,
                 email, tel,
                 user_id, tipo_doc, cargo)
            )

            # 5) Confirmar
            mysql.connection.commit()
            flash('Usuario y funcionario creados correctamente', 'success')
            return redirect(url_for('crearUsuarios'))

        except Exception as e:
          
            print(traceback.format_exc())
            mysql.connection.rollback()
            flash(f'Error al crear usuario: {e}', 'danger')
            return redirect(url_for('crearUsuarios'))

    # se carga los datos, para mostrar
    cur.execute('SELECT cod_tipo_doc, tipo_doc FROM tipo_documento')
    tipos_documento = cur.fetchall()

    cur.execute('SELECT codigo_cargo, nombre_cargo FROM cargo')
    cargos = cur.fetchall()

    cur.execute('SELECT id_estado, tipo_de_estado FROM estado')
    estados = cur.fetchall()

    cur.execute(
        '''SELECT MIN(id_rol) AS id_rol, tipo_de_rol
             FROM rol
         GROUP BY tipo_de_rol'''
    )
    roles = cur.fetchall()
    cur.close()

    return render_template(
        'crearUsuarios.html',
        tipos_documento=tipos_documento,
        cargos=cargos,
        estados=estados,
        roles=roles
    )



if __name__ == '__main__':
    app.run(debug=True)