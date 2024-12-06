"use server"

import path from 'path';
import { readData, writeData } from '../utils';
import { Document, Project } from '@/app/types/type';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function addDocument(projectId: number, name: string, file: string, versionName: string) {
  const data = await readData(dbPath);

  // Trouver le projet par ID
  const project = data.projects.find((project: Project) => project.id === projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  // Créer un nouveau document
  const newDocument = {
    id: Date.now(),
    name,
    createdAt: new Date().toISOString(),
    versions: [
      {
        versionName,
        file,
        createdAt: new Date().toISOString(),
        comments: [],
      },
    ],
  };

  project.documents.push(newDocument);
  await writeData(dbPath, data);

  return newDocument;
}

export async function addVersionToDocument(projectId: number, documentId: number, versionName: string, file: string) {
  const data = await readData(dbPath);

  const project = data.projects.find((proj: Project) => proj.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  const document = project.documents.find((doc: Document) => doc.id === documentId);

  if (!document) {
    throw new Error('Document not found');
  }

  const newVersion = {
    versionName,
    file,
    createdAt: new Date().toISOString(),
    comments: [],
  };

  document.versions.push(newVersion);
  await writeData(dbPath, data);

  return document;
}

export async function addCommentToVersion(projectId: number, documentId: number, versionIndex: number, text: string) {
  const data = await readData(dbPath);

  const project = data.projects.find((proj: Project) => proj.id === projectId);

  if (!project) {
    throw new Error('Project not found');
  }

  const document = project.documents.find((doc: Document) => doc.id === documentId);

  if (!document) {
    throw new Error('Document not found');
  }

  const version = document.versions[versionIndex];

  if (!version) {
    throw new Error('Version not found');
  }

  const newComment = {
    id: Date.now(),
    text,
    author: 'Current User', // Remplacer par l'utilisateur actuel
  };

  version.comments.push(newComment);
  await writeData(dbPath, data);

  return document;
}

export async function getDocumentById(projectId: number, documentId: number) {
  const data = await readData(dbPath);

  const project = data.projects.find((proj: Project) => proj.id === projectId);

  if (!project) {
      throw new Error('Project not found');
  }

  const document = project.documents.find((doc: Document) => doc.id === documentId);

  if (!document) {
      throw new Error('Document not found');
  }

  return document;
}

export async function updateDocumentById(projectId: number, documentId: number, newDoc: Document) {
  const data = await readData(dbPath);

  const project = data.projects.find((proj: Project) => proj.id === projectId);

  if (!project) {
      throw new Error('Project not found');
  }

  const document = project.documents.find((doc: Document) => doc.id === documentId);

  if (!document) {
      throw new Error('Document not found');
  }

  for (let i=0, c=project.documents.length; i < c; i++) {
    if (project.documents[i].id === documentId) {
      project.documents[i] = newDoc
      break
    }
  }


  for (let i=0, c=data.projects.length; i < c; i++){
    if (data.projects[i].id === projectId){
      data.projects[i] = project
      break
    }
  }

  await writeData(dbPath, data);
}