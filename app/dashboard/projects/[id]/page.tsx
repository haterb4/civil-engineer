'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjectById } from '@/app/actions/projects/projectActions';
import { addDocumentToProject } from '@/app/actions/projects/projectActions';
import { Comment, Document, Project, ProjectUser, Version } from '@/app/types/type';
import { addCommentToVersion, addVersionToDocument } from '@/app/actions/documents/documentActions';

interface ProjectDetailsProps {
  params: {
    id: string;
  };
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ params }) => {
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [showVersionForm, setShowVersionForm] = useState<Record<number, boolean>>({});
  const [showCommentForm, setShowCommentForm] = useState<Record<string, boolean>>({});
  const [newDocumentName, setNewDocumentName] = useState('');
  const [newDocumentFile, setNewDocumentFile] = useState<File | null>(null);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionFile, setNewVersionFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');

  const { id } = params;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProjectById(parseInt(id));
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

  const handleAddDocument = async () => {
    if (newDocumentName && newDocumentFile) {
      try {
        const formData = new FormData();
        formData.append("file", newDocumentFile);

        const data = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const res: {
          Message: string;
          path?: string;
          status: number;
        } = await data.json()

        if (!res.path) return
        

        const newDocument = await addDocumentToProject(
          parseInt(id),
          newDocumentName,
          res.path,
          'v1.0'
        );

        if (!project) {
          return;
        }

        setProject({
          ...project,
          documents: [...project.documents, newDocument],
        });
        setNewDocumentName('');
        setNewDocumentFile(null);
        setShowDocumentForm(false);
      } catch (error) {
        console.error('Error adding document:', error);
      }
    }
  };

  const handleAddVersion = async (docId: number) => {
    if (newVersionName && newVersionFile) {
      try {
        const formData = new FormData();
        formData.append("file", newVersionFile);

        const data = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const res: {
          Message: string;
          path?: string;
          status: number;
        } = await data.json()

        if (!res.path) return
        const updatedDocument = await addVersionToDocument(
          parseInt(id),
          docId,
          newVersionName,
          res.path
        );

        if (!project) {
          return;
        }

        setProject({
          ...project,
          documents: project.documents.map((doc: Document) =>
            doc.id === docId ? updatedDocument : doc
          ),
        });
        setNewVersionName('');
        setNewVersionFile(null);
        setShowVersionForm({ ...showVersionForm, [docId]: false });
      } catch (error) {
        console.error('Error adding version:', error);
      }
    }
  };

  const handleAddComment = async (docId: number, versionIndex: number) => {
    try {
      const updatedDocument = await addCommentToVersion(
        parseInt(id),
        docId,
        versionIndex,
        comment
      );

      if (!project) {
        return;
      }
      const documents: Document[] = project.documents.map((doc: Document) =>
        doc.id === docId ? updatedDocument : doc
      )
      setProject({
        ...project,
        documents: documents,
      });

      setComment('');
      setShowCommentForm({ ...showCommentForm, [`${docId}-${versionIndex}`]: false });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">{project.name}</h1>
      <p className="mb-6">{project.description}</p>

      {/* Gestion des utilisateurs */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <Link href={`/dashboard/projects/${id}/users`} className="text-blue-500">
            Add user
          </Link>
        </div>
        <ul className="space-y-2">
          {project.users.map((user: ProjectUser) => (
            <li key={user.user.id} className="flex justify-between">
              <span>
                {user.user.name} - {user.role}
              </span>
              <button className="text-red-600 hover:underline">Remove</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Documents */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>

        {/* Liste des documents */}
        <ul className="space-y-6">
          {project.documents.map((doc: Document) => (
            <li key={doc.id} className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <Link href={`/dashboard/projects/${params.id}/document/${doc.id}`} className="text-lg font-bold">{doc.name}</Link>
                <span className="text-sm text-gray-600">Created on {doc.createdAt}</span>
              </div>

              {/* Liste des versions */}
              <div className="space-y-4">
                {doc.versions.map((version: Version, versionIndex: number) => (
                  <div key={version.versionName} className="p-4 bg-gray-50 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Version {version.versionName}</span>
                      <span className="text-sm text-gray-600">Created on {version.createdAt}</span>
                    </div>

                    {/* Commentaires */}
                    <div className="ml-4 mt-2">
                      <h4 className="font-semibold text-gray-600">Comments</h4>
                      {version.comments.map((comment: Comment) => (
                        <p key={comment.id} className="text-sm text-gray-700 mb-2">
                          <span className='font-bold'>{comment.author}:</span> {comment.text}
                        </p>
                      ))}

                      {/* Bouton pour afficher/masquer le formulaire d'ajout de commentaires */}
                      <button
                        className="text-blue-600 hover:underline mt-2"
                        onClick={() =>
                          setShowCommentForm({
                            ...showCommentForm,
                            [`${doc.id}-${versionIndex}`]:
                              !showCommentForm[`${doc.id}-${versionIndex}`],
                          })
                        }
                      >
                        {showCommentForm[`${doc.id}-${versionIndex}`]
                          ? 'Hide Comment Form'
                          : 'Add Comment'}
                      </button>

                      {/* Formulaire pour ajouter un commentaire */}
                      {showCommentForm[`${doc.id}-${versionIndex}`] && (
                        <div className="flex items-center space-x-2 mt-2">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            onClick={() => handleAddComment(doc.id, versionIndex)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton pour afficher/masquer le formulaire d'ajout de version */}
              <button
                className="text-blue-600 hover:underline mt-4"
                onClick={() =>
                  setShowVersionForm({
                    ...showVersionForm,
                    [doc.id]: !showVersionForm[doc.id],
                  })
                }
              >
                {showVersionForm[doc.id] ? 'Hide Version Form' : 'Add New Version'}
              </button>

              {/* Formulaire pour ajouter une nouvelle version */}
              {showVersionForm[doc.id] && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-600 mb-2">Add New Version</h4>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Version Name"
                      value={newVersionName}
                      onChange={(e) => setNewVersionName(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        setNewVersionFile(e.target.files ? e.target.files[0] : null)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleAddVersion(doc.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
                    >
                      Add Version
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Bouton pour afficher/masquer le formulaire d'ajout de document */}
        <button
          className="text-blue-600 hover:underline mt-6"
          onClick={() => setShowDocumentForm(!showDocumentForm)}
        >
          {showDocumentForm ? 'Hide Document Form' : 'Add New Document'}
        </button>

        {/* Formulaire pour ajouter un nouveau document */}
        {showDocumentForm && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Add New Document</h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Document Name"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="file"
                onChange={(e) => setNewDocumentFile(e.target.files ? e.target.files[0] : null)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddDocument}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
              >
                Add Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
