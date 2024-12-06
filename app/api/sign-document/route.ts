import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import { randomUUID } from "crypto";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    // Vérifier le type de fichier
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Générer un nom de fichier unique
    const uniqueFilename = `${randomUUID()}_${file.name.replace(/\s+/g, '_')}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, uniqueFilename);

    await writeFile(filePath, buffer);

    // Retourner le chemin relatif du fichier
    const relativePath = path.join("uploads", uniqueFilename).replace(/\\/g, '/');

    return NextResponse.json({ 
      message: "File uploaded successfully", 
      path: relativePath, 
      status: 201 
    });

  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
};