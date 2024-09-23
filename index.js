const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

//const  libros = [
//    {id: 1, titulo: "1984", autor: "George Orwell"},
//    {id: 2, titulo: "Cien años de soledad", autor: "Gabriel Garcia Marquez"},
//];

const mongoUri = process.env.MONGODB_URI

try {
    mongoose.connect(mongoUri)
    console.log("Conectado a MongoDB")
} catch (error) {
    console.error("Error de conexion", error)
}

const libroschema = new mongoose.Schema({
    titulo:String,
    autor:String,
});

const Libro = mongoose.model("Libro", libroschema);

app.get("/", (req, res) => {
    res.send("Bienvenidos a la app de libros");
})

app.post("/libros", async (req, res) => {
    const libro = new Libro({
    titulo: req.body.titulo,
    autor: req.body.autor,
    });

    try {
    await libro.save();
    res.json(libro);
    } catch (error) {
    res.status(500).send("Error al guardar el libro", error);
    }
});

app.get("/libros", async (req, res) => {
    try {
    const libros = await Libro.find();
    res.json(libros);
    } catch (error) {
    res.status(500).send("Error al obtener libros", error);
    }
});

app.get("/libros/:id", async (req, res) => {
    try {
    const libro = await Libro.findById(req.params.id);
    if (libro) {
        res.json(libro);
    } else {
        res.status(404).send("Libro no encontrado");
    }
    } catch (error) {
    res.status(500).send("Error al buscar el libro", error);
    }
});

app.put("/libros/:id", async (req, res) => {
    try {
    const libro = await Libro.findByIdAndUpdate(
        req.params.id,
        {
        titulo: req.body.titulo,
        autor: req.body.autor,
        },
        { new: true } 
    );

    if (libro) {
        res.json(libro);
    } else {
        res.status(404).send("Libro no encontrado");
    }
    } catch (error) {
    res.status(500).send("Error al actualizar el libro");
    }
});

app.delete("/libros/:id", async (req, res) => {
    try {
    const libro = await Libro.findByIdAndRemove(req.params.id);
    if (libro) {
        res.status(204).send();
    } else {
        res.status(404).send("Libro no encontrado");
    }
    } catch (error) {
    res.status(500).send("Error al eliminar el libro");
    }
});

app.get("/libros", (req, res) => {
})


app.listen(3000, () => {
    console.log("servidor ejecutandose en http://localhost:3000")
})