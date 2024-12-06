"use server"

import fs from 'fs';

// Fonction pour lire les données
export const readData = async (dbPath: string) => {
    const jsonData = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(jsonData);
};
  
  // Fonction pour écrire les données
export const writeData = async (dbPath: string, data: object) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  };