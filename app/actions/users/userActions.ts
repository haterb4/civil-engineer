"use server"

import path from 'path';
import { readData, writeData } from '../utils';
import { User } from '@/app/types/type';

// Chemin vers le fichier JSON
const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function registerUser(name: string, email: string, password: string, role: string) {
  const data = await readData(dbPath);

  // Vérifier si l'utilisateur existe déjà
  const existingUser = data.users.find((user: User) => user.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Créer un nouvel utilisateur
  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    role,
  };

  // Ajouter l'utilisateur à la base de données JSON
  data.users.push(newUser);
  await writeData(dbPath, data);

  return newUser;
}

export async function loginUser(email: string, password: string) {
  const data = await readData(dbPath);

  // Vérifier les informations de connexion
  const user = data.users.find((user: User) => user.email === email && user.password === password);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  return user;
}

export async function getUsers() {
  const data = await readData(dbPath);
  return data.users;
}

export async function updateUser(id: number, name: string, email: string, password: string, role: string) {
  const data = await readData(dbPath);

  const userIndex = data.users.findIndex((user: User) => user.id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  data.users[userIndex] = { id, name, email, password, role };
  await writeData(dbPath, data);

  return data.users[userIndex];
}

export async function deleteUser(id: number) {
  const data = await readData(dbPath);

  const userIndex = data.users.findIndex((user: User) => user.id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  data.users.splice(userIndex, 1);
  await writeData(dbPath, data);

  return { message: 'User deleted successfully' };
}