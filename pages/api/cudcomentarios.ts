import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises"; // Asegúrate de que estás usando esta importación
import path from "path";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { dataActComent } = req.body;

    try {
      for (let actividad of dataActComent) {
        let lista_comentarios = await prisma.comentarios.findMany({
          where: { id_actividades: actividad.id },
        });
        let lista_imagenes = await prisma.images.findMany({
          where: { id_actividades: actividad.id },
        });

        // Manejo de comentarios
        for (let comentario of actividad.comentario) {
          if (comentario.id && lista_comentarios.some((c) => c.id === comentario.id)) {
            await prisma.comentarios.update({
              where: { id: parseInt(comentario.id) },
              data: {
                comentario: comentario.objeto,
              },
            });
            lista_comentarios = lista_comentarios.filter((c) => c.id !== comentario.id);
          } else {
            await prisma.comentarios.create({
              data: {
                id_actividades: actividad.id,
                comentario: comentario.objeto,
              },
            });
          }
        }

        if (lista_comentarios.length > 0) {
          for (let comentario of lista_comentarios) {
            await prisma.comentarios.delete({
              where: { id: comentario.id },
            });
          }
        }

        // Manejo de imágenes
        const imagesDir = path.join(process.cwd(), "public", "images", `${actividad.id}`);
        await fs.mkdir(imagesDir, { recursive: true });

        for (let imagen of actividad.imagen) {
          const imageBuffer = Buffer.from(imagen.data, "base64");
          const imagePath = path.join(imagesDir, imagen.name);

          try {
            if (imagen.id && lista_imagenes.some((i) => i.id === imagen.id)) {
              // Escribir el buffer directamente en el archivo
              await fs.writeFile(imagePath, imageBuffer);
              await prisma.images.update({
                where: { id: parseInt(imagen.id) },
                data: {
                  name: imagen.name,
                  path: imagePath,
                  id_actividades: actividad.id,
                },
              });
              lista_imagenes = lista_imagenes.filter((i) => i.id !== imagen.id);
            } else {
              // Escribir el buffer directamente en el archivo
              await fs.writeFile(imagePath, imageBuffer);
              await prisma.images.create({
                data: {
                  name: imagen.name,
                  path: imagePath,
                  id_actividades: actividad.id,
                },
              });
            }
          } catch (writeError) {
            console.error(`Error al escribir la imagen ${imagen.name}:`, writeError);
          }
        }

        if (lista_imagenes.length > 0) {
          for (let imagen of lista_imagenes) {
            await prisma.images.delete({
              where: { id: imagen.id },
            });
          }
        }
      }
      res.status(200).json({ message: "Comentarios e imágenes procesados correctamente." });
    } catch (error) {
      console.error("Error al crear, actualizar o eliminar comentarios e imágenes:", error);
      res.status(500).json({ error: "Error al crear, actualizar o eliminar comentarios e imágenes" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
