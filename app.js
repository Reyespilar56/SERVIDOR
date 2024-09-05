const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});

app.use(cors());
app.use(express.json());
//------------------------------------------------Instalación------------------------------------------------------------------------------------------------------------------------------------
app.post("/instalacion", async (req, res) => {
  try {

    const { Nombre, email, telefono, referencias, coordenadas, telefonocasa, domicilio, paquete, Hora, Minuto, Fecha,URL_INE,URL_REVERSO,URL_DOMICILIO,notas } = req.body.data;
    // Formatear la fecha y hora para enviar a la API de Mikrosystem


    const respuesta = await axios({
      method: 'post',
      url: "https://demo.mikrosystem.net/api/v1/NewPreRegistro",
      data: {
        token: 'Smx2SVdkbUZIdjlCUlkxdFo1cUNMQT09',
        cliente: Nombre,
        email: email,
        movil: telefono,
        Notas: "REFERENCIAS: " + referencias + "\n" +
        "COORDENADAS: " + coordenadas + "\n" +
        "PAQUETE: " + paquete + "\n" +
        "FOTO_INE: " + URL_INE + "\n" +
        "FOTO_REVERSO: " + URL_REVERSO + "\n" +
        "FOTO_DOMICILIO: " + URL_DOMICILIO +"\n"+
        "NOTAS:" + notas,
// Concatenan
   telefono: telefonocasa,
        direccion: domicilio,
        cedula: req.body.data.ID,
        fecha_instalacion: `${Fecha},${Hora},${Minuto}`// Concatenando
      },

      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer Smx2SVdkbUZIdjlCUlkxdFo1cUNMQT09'
      }
    });


    console.log("Respuesta de instalación:", respuesta.data);
    res.send("Instalación exitosa");
  } catch (error) {
    console.error("Error al realizar la instalación:", error);
    res.status(500).send("Error al realizar la instalación: " + error.data);
  }
});

//-----------------------DatoUsuario
app.post("/usuario", async (req, res) => {
  try {
    const { Nombre, Telefono, TelefonoMovil, Direccion, contrasena, correoElectronico, usuario, id } = req.body.data;
    const Respuesta = await axios({

      method: 'post',
      url: "https://sheet.best/api/sheets/ec98e35d-2250-4059-a492-0a25b82d763e/tabs/ventasDigy",

      data: {
        nombre: Nombre,
        usuario: usuario,
        clave: contrasena,
        correo: correoElectronico,
        telefono: Telefono,
        movil: TelefonoMovil,
        direccion: Direccion,
        id: id,
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("Agregado correctamente:", Respuesta.data,);

    res.send("Agregado con exito");
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    res.status(500).send("Error al registrar usuario: " + error.data);
  }
});

//------------Login 
app.get("/Login", async (req, res) => {
  try {
    const { usuario, contrasena } = req.query; // Para solicitudes GET, se deben utilizar los parámetros de consulta

    // Consulta Google Sheets para obtener el usuario
    const respuesta = await axios({
      method: "get",
      url: `https://sheet.best/api/sheets/ec98e35d-2250-4059-a492-0a25b82d763e/tabs/ventasDigy/clave/${contrasena}`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const usuarios = respuesta.data;

    // Validar que el usuario y la contraseña coincidan
    const usuarioValido = usuarios.find(u => u.usuario === usuario && u.clave === contrasena);
    console.log("usuario validado", usuarioValido);

    if (usuarioValido) {
      console.log("Bienvenido Usuario........ !!!:", usuarioValido);
      res.status(200).json(usuarioValido);
    } else {
      console.log("si llega");
      res.status(400).json("Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error al ingresar :", error.message);
    res.status(500).send("Error al ingresar: " + error.message);
  }
});


//----Historial


app.get('/Historial', async (req, res) => {
  const { filtroTipo, valor } = req.query;
  console.log("DYGY", filtroTipo);
  console.log("query", req.query);

  try {
    // Realizar la solicitud a la API externa
    const respuesta = await axios({
      method: "get",
      url: "https://installations-calendar-back.vercel.app/ventas/instalaciones-ventas",
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const datos = respuesta.data;
    //console.log('Datos recibidos:', datos);

    let datosFiltrados = [];

    // Aplicar el filtro según el tipo especificado
    if (!filtroTipo || filtroTipo === 'generales') {
      datosFiltrados = datos;
    } else {
      switch (filtroTipo) {
        case 'cliente':
          datosFiltrados = datos.filter(dato => dato.cliente.includes(valor));
          break;
        case 'zona':
          datosFiltrados = datos.filter(dato => dato.direccion.includes(valor));
          break;
        case 'usuario':
          datosFiltrados = datos.filter(dato => dato.usuario === valor);
          break;
        case 'movil':
          datosFiltrados = datos.filter(dato => dato.movil.includes(valor));
          break;
        case 'telefono':
          datosFiltrados = datos.filter(dato => dato.telefono.includes(valor));
          break;
        case 'fecha':
          datosFiltrados = datos.filter(dato => dato.fecha_instalacion.includes(valor));
          break;
        case 'horaInstalacion':
          datosFiltrados = datos.filter(dato => dato.coordenadas.includes(valor));
          break;
        case 'ubicacion':
          datosFiltrados = datos.filter(dato => dato.ubicacion.includes(valor));
          break;
        default:


          break;
      }
    }
    //console.log("datosFiltrados", datosFiltrados);
    // Enviar la respuesta con los datos filtrados
    if (datosFiltrados && datosFiltrados.length > 0) {
      res.status(200).json(datosFiltrados);
    } else {
      res.status(404).send("No se encontraron datos para la consulta.");
    }
  } catch (error) {
    console.error("Error al obtener datos:", error.message);
    res.status(500).send("Error en el servidor: " + error.message);
  }
});




