import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Conectado a Mongo Atlas"))
.catch(err => console.error("Error al conectar", err))

// Definir el modelo 
const ofertaSchema = new mongoose.Schema({
nombreProducto: { type: String, required: true },
precioVenta: { type: Number, required: true },
municipio: { type: String, required: true },
nombreContacto: { type: String, required: true },
celular: { type: String, required: true }
});
const Oferta = mongoose.model("Oferta", ofertaSchema, "ofertas");

//consultar todos los documentos
app.get("/ofertas", async (req, res) => {
  try {
    const ofertas = await Oferta.find();
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las ofertas" });
  }
});


//obtener por id
app.get("/ofertas/:id", async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id);
    if (!oferta) return res.status(404).json({ error: "Oferta no encontrada" });
    res.json(oferta);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la oferta" });
  }
});


//POST
app.post("/ofertas", async (req, res) => {
  try {
    const nuevaOferta = new Oferta(req.body);
    await nuevaOferta.save();
    res.status(201).json(nuevaOferta);
  } catch (error) {
    res.status(400).json({ error: "Error al crear la oferta" });
  }
});

//PUT
app.put("/ofertas/:id", async (req, res) => {
  try {
    const ofertaActualizada = await Oferta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!ofertaActualizada) return res.status(404).json({ error: "Oferta no encontrada" });
    res.json(ofertaActualizada);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar la oferta" });
  }
});


//DELETE
app.delete("/ofertas/:id", async (req, res) => {
  try {
    const eliminada = await Oferta.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ error: "Oferta no encontrada" });
    res.json({ mensaje: "Oferta eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la oferta" });
  }
});


// Aquí tomas el puerto de .env
const PORT = process.env.PORT || 3000;
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


