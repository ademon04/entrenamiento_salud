const mongoose = require('mongoose');

// Subdocumento: ejercicio individual dentro del entrenamiento
const ejercicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },       // Nombre del ejercicio
  peso: { type: Number, required: true },          // Peso utilizado
  repeticiones: { type: Number, required: true },  // Número de reps
  series: { type: Number, required: true },        // Número de series
  tipo: {
    type: String,
    enum: ["fuerza", "hipertrofia", "resistencia", "potencia"],
    required: true
  }
});

// Subdocumento: rendimiento por ejercicio
const rendimientoEjercicioSchema = new mongoose.Schema({
  nombre: String,
  porcentaje: Number
});

// Subdocumento: entrenamiento diario
const entrenamientoSchema = new mongoose.Schema({
  estadoEmocional: {
    type: String,
    enum: ["motivado", "triste", "ansioso", "indispuesto", "enojado", "neutral", "enérgico"],
    required: true
  },
  calidadSueno: {
    type: String,
    enum: ["bueno", "regular", "malo"]
  },
  nivelEnergia: {
    type: Number,
    min: 1,
    max: 10
  },
  comentarios: {
    type: String,
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  ejercicios: [ejercicioSchema],  // Varios ejercicios por entrenamiento

  rendimiento: {
    promedio: Number,
    evaluacion: {
      type: String,
      enum: ["excelente", "bueno", "regular", "bajo"]
    },
    ejercicios: [rendimientoEjercicioSchema]
  }
});

// Subdocumento: máximos históricos
const gymMaxSchema = new mongoose.Schema({
  benchPress: { type: Number, required: true },
  backSquat: { type: Number, required: true },
  powerClean: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true }
});

// Subdocumento: historial de lesiones
const lesionSchema = new mongoose.Schema({
  zona: String,
  fecha: Date,
  gravedad: {
    type: String,
    enum: ["leve", "moderada", "grave"]
  },
  observaciones: String
});

// Esquema principal del usuario
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  genero: {
    type: String,
    enum: ["masculino", "femenino", "otro"]
  },
  peso: Number,       // en kg
  estatura: Number,   // en cm
  estadoFisico: {
    type: String,
    enum: ["deportista", "sedentario", "atleta"],
    required: true
  },
  objetivo: {
    type: String,
    enum: ["fuerza", "hipertrofia", "rendimiento", "salud general", "pérdida de grasa"]
  },
  frecuenciaSemanal: Number,
  marcas: gymMaxSchema,               // máximos históricos (1 set)
  entrenamiento: [entrenamientoSchema], // muchos entrenamientos
  lesiones: [lesionSchema]             // historial de lesiones
});

const Personas = mongoose.model('Personas', userSchema);
module.exports = { Personas };


