"use server"

import { Document, Project, ProjectUser } from '@/app/types/type';
import path from 'path';
import { readData, writeData } from '../utils';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function createProject(name: string, description: string, createdBy: number, users: ProjectUser[]) {
  const data = await readData(dbPath);

  // Créer un nouveau projet
  const newProject: Project = {
    id: Date.now(),
    name,
    description,
    createdBy,
    users,
    status: 'Ongoing',
    documents: [],
  };

  // Ajouter le projet à la base de données JSON
  data.projects.push(newProject);
  await writeData(dbPath, data);

  return newProject;
}

export async function getProjects() {
  const data = await readData(dbPath);
  return data.projects;
}

export async function getProjectById(projectId: number) {
  const data = await readData(dbPath);

  const project = data.projects.find((proj: Project) => proj.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  return project;
}

export async function addDocumentToProject(projectId: number, name: string, file: string, versionName: string) {
  const data = await readData(dbPath);

  const project = data.projects.find((proj: Project) => proj.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  console.log({
    projectId,
    name,
    versionName
  })

  const newDocument: Document = {
    id: Date.now(),
    name,
    createdAt: new Date().toISOString(),
    versions: [
      {
        versionName,
        file,
        createdAt: new Date().toISOString(),
        comments:[],
      },
    ],
  };

  project.documents.push(newDocument);
  await writeData(dbPath, data);

  return newDocument;
}