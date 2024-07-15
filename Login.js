const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = 3001; // Puedes cambiar el puerto si es necesario

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    const { nombre, correoElectronico, contrasena, Telefono, TelefnoMovil, Direccion } = req.body;

    const data = {
        nombre: nombre,
        correoElectronico: correoElectronico,
        contrasena: contrasena,
        Telefono: Telefono,
        TelefnoMovil: TelefnoMovil,
        Direccion: Direccion
    };

    try {
        const response = await fetch(' https://sheet.best/api/sheets/ec98e35d-2250-4059-a492-0a25b82d763e/tabs/ventasDigy', { // Reemplaza YOUR_SHEET_ID con el ID de tu hoja de Sheet.best
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        res.status(200).json({ message: 'Registro exitoso', data: responseData });
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error en el registro. Inténtalo de nuevo.', error: error.toString() });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${3000}`);
});
