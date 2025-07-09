const express = require('express');
const mongoose = require('mongoose');
const { Personas } = require('./scheema');

const app = express();
require('dotenv').config();


// Middleware para leer JSON en peticiones
app.use(express.json());

// Conexión a
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGODB_URI;
// conexion a mongo
mongoose.connect(mongoURI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error de conexión a MongoDB:", err));

// Endpoint base
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});


// 1. Crear nueva persona (usuario)
app.post('/personas', async (req, res) => {
  try {
    const nuevaPersona = new Personas(req.body);
    await nuevaPersona.save();
    res.status(201).json({ message: "Usuario agregado correctamente" });
    console.log(nuevaPersona);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar el usuario" });
  }
});


//  2. Obtener todas las personas
app.get('/personas', async (req, res) => {
  try {
    const personas = await Personas.find();
    res.status(200).json(personas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener personas" });
  }
});


// 3. Obtener una persona por ID
app.get('/personas/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const persona = await Personas.findById(postId);
    if (!persona) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(persona);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
});


//  4. Agregar marcas máximas a una persona
app.post('/personas/:postId/marcas', async (req, res) => {
  try {
    const { postId } = req.params;
    const persona = await Personas.findById(postId);
    if (!persona) return res.status(404).json({ error: 'Usuario no encontrado' });

    persona.marcas = req.body; // Reemplazamos o agregamos marcas máximas
    await persona.save();
    res.json(persona);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar marcas máximas" });
  }
});


//  5. Registrar un entrenamiento
app.post('/personas/:postId/entrenamientos', async (req, res) => {
  try {
    const { postId } = req.params;
    const persona = await Personas.findById(postId);
    if (!persona) return res.status(404).json({ message: "Usuario no encontrado" });

    persona.entrenamiento.push(req.body); // Agregamos el entrenamiento completo
    await persona.save();
    res.json(persona);
  } catch (error) {
    res.status(500).json({ message: "Error al guardar entrenamiento" });
  }
});


//  6. Analizar rendimiento del último entrenamiento
app.get('/personas/:postId/analisis', async (req, res) => {
  try {
    const { postId } = req.params;
    const persona = await Personas.findById(postId);
    if (!persona) return res.status(404).json({ message: "Usuario no encontrado" });

    const max = persona.marcas;
    if (!max || !max.benchPress || !max.backSquat || !max.powerClean) {
      return res.status(400).json({ message: "Faltan marcas máximas" });
    }

    const ultimo = persona.entrenamiento.at(-1);
    if (!ultimo || !ultimo.ejercicios) {
      return res.status(400).json({ message: "No hay entrenamientos registrados" });
    }

    // Calcular rendimiento por ejercicio (solo si existen los 3 básicos)
    const rendimiento = {
      benchPress: ((ultimo.ejercicios.find(e => e.nombre === 'benchPress')?.peso || 0) / max.benchPress * 100).toFixed(2),
      backSquat: ((ultimo.ejercicios.find(e => e.nombre === 'backSquat')?.peso || 0) / max.backSquat * 100).toFixed(2),
      powerClean: ((ultimo.ejercicios.find(e => e.nombre === 'powerClean')?.peso || 0) / max.powerClean * 100).toFixed(2)
    };

    // Evaluación del rendimiento 
    const promedio = (
      (parseFloat(rendimiento.benchPress) +
        parseFloat(rendimiento.backSquat) +
        parseFloat(rendimiento.powerClean)) / 3
    ).toFixed(2);

    let evaluacion = "bajo";
    if (promedio >= 90) evaluacion = "excelente";
    else if (promedio >= 75) evaluacion = "bueno";
    else if (promedio >= 60) evaluacion = "regular";

    // Guardar en el esquema
    ultimo.rendimiento = {
      promedio,
      evaluacion,
      ejercicios: [
        { nombre: "benchPress", porcentaje: parseFloat(rendimiento.benchPress) },
        { nombre: "backSquat", porcentaje: parseFloat(rendimiento.backSquat) },
        { nombre: "powerClean", porcentaje: parseFloat(rendimiento.powerClean) }
      ]
    };

    await persona.save();

    // Respuesta con el estado emocional y resultado
    res.json({
      estadoEmocional: ultimo.estadoEmocional,
      promedio,
      evaluacion,
      rendimiento: ultimo.rendimiento.ejercicios
    });

  } catch (error) {
    console.error("Error en el análisis:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

/// lesiones 
app.post('/personas/:postId/lesiones', async (req, res) => {
  try {
    const { postId } = req.params;
    const persona = await Personas.findById(postId);

    if (!persona) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    persona.lesiones.push(req.body); // Agrega la lesión desde el body
    await persona.save(); // Guarda cambios

    res.status(200).json({
      message: "Lesión registrada exitosamente",
      lesiones: persona.lesiones
    });

  } catch (error) {
    console.error("Error al registrar lesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


// 🟢 Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${3001}`);
});


  /*const backSquatMaximo= analisis.marcas.backSquat;
     if(!backSquatMaximo || backSquatMaximo <=0){
        res.status(501).json({error:"no data"})
     }


const resultados = analisis.entrenamiento.map(entrenamiento=>{
          const backSquatDelDia = entrenamiento.ejercicios.backSquat;
          if(backSquatDelDia &&backSquatMaximo){

            const result = backSquatDelDia/backSquatMaximo*100
            res.json(result);
          }

})*/
 