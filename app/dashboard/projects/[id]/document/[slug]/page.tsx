'use client';

import { useState, useEffect, useRef } from 'react';
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import SignatureCanvas from 'react-signature-canvas';
import { getDocumentById, addCommentToVersion, updateDocumentById } from '@/app/actions/documents/documentActions';
import { Comment, Document, Version } from '@/app/types/type';
import { PDFDocument } from 'pdf-lib';
import { FaComment, FaPencilAlt } from 'react-icons/fa';

interface ProjectDetailsProps {
  params: {
    id: string;
    slug: string;
  };
}

const DocumentView: React.FC<ProjectDetailsProps> = ({ params }) => {
    const { id, slug } = params;
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [document, setDocument] = useState<Document | null>(null);
    const [signature, setSignature] = useState<string | undefined>(undefined);
    const [comment, setComment] = useState('');
    const [showCommentForm, setShowCommentForm] = useState<Record<number, boolean>>({});
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [dialog, setDialog] = useState({
        signature: false,
        comments: false
    })

    useEffect(() => {
        const fetchDocument = async () => {
            if (id && slug) {
                try {
                    const documentData = await getDocumentById(parseInt(id as string), parseInt(slug as string));
                    setDocument(documentData);
                } catch (error) {
                    console.error('Error fetching document:', error);
                }
            }
        };

        fetchDocument();
    }, [id, slug]);

    const handleSaveSignature = async () => {
        if (sigCanvas.current?.isEmpty()) {
          alert('Please provide a signature first.');
        } else {
            const signatureDataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
            setSignature(signatureDataURL);
            if (!signatureDataURL) {
                console.log("Empty signature data url")
                return
            }
            await applySignatureToPdf(signatureDataURL);
        }
      };

      const applySignatureToPdf = async (signatureDataURL: string) => {
        if (!document) return;
    
        const pdfBytes = await fetch(`/${document.versions[0].file}`).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pngImage = await pdfDoc.embedPng(signatureDataURL);
    
        const pages = pdfDoc.getPages();
        const lastPage = pages[pages.length - 1];
        const { width } = lastPage.getSize();
    
        // Calculate position for bottom right corner
        const signatureWidth = 100;
        const signatureHeight = 50;
        const padding = 20; // Add some padding from the edges
    
        lastPage.drawImage(pngImage, {
          x: width - (signatureWidth + padding)*(document.signatures.length + 1),
          y: padding, // In PDF coordinates, y=0 is at the bottom
          width: signatureWidth,
          height: signatureHeight,
        });
    
        const pdfBytes2 = await pdfDoc.save();
        const blob = new Blob([pdfBytes2], { type: 'application/pdf' });

        await sendSignedPdfToServer(blob);
    };

    const handleAddComment = async (versionIndex: number) => {
        if (comment) {
            try {
                const updatedDocument = await addCommentToVersion(
                    parseInt(id as string),
                    parseInt(slug as string),
                    versionIndex,
                    comment
                );
                setDocument(updatedDocument);
                setComment('');
                setShowCommentForm({ ...showCommentForm, [versionIndex]: false });
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };

    if (!document) {
        return <div>Loading...</div>;
    }

    const sendSignedPdfToServer = async (pdfBlob: Blob) => {
        const formData = new FormData();
        formData.append('file', pdfBlob, 'signed_document.pdf');
        
        try {
            const response = await fetch('/api/sign-document', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Failed to send signed document');
            }
    
            const result = await response.json();
            console.log('Server response:', result);
            //save the response.path to the right document
            const tmpDoc = {...document}
            tmpDoc.versions[0].file = result.path
            tmpDoc.signatures.push({userId: 1, date: new Date()})
            await updateDocumentById(Number.parseInt(id), Number.parseInt(slug), tmpDoc)
            setDocument(tmpDoc)
            
        } catch (error) {
            console.error('Error sending signed document:', error);
            alert('Failed to save signed document. Please try again.');
        }
    };

    return (
        <div className="px-10 bg-gray-100 max-h-screen relative">
            {/* Visualisation du PDF */}
            <div className='hidden'>{signature}</div>
            <div className="">
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`}>
                    <div className="border rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
                        <Viewer
                            fileUrl={`/${document.versions[0].file}`}
                            plugins={[defaultLayoutPluginInstance]}
                        />
                    </div>
                </Worker>
            </div>

            <div className='flex flex-col space-y-3 fixed bottom-4 right-4 z-100'>
                <button
                    onClick={() => setDialog({signature: !dialog.signature, comments: false})}
                    className='w-8 h-8 rounded-full border border-blue-600 bg-blue-600 text-white flex justify-center items-center hover:bg-blue-500 hover:border-blue-500'
                >
                    <FaPencilAlt />
                </button>
                <button
                    onClick={() => setDialog({signature: false, comments: !dialog.comments})}
                    className='w-8 h-8 rounded-full border border-blue-600 bg-blue-600 text-white flex justify-center items-center hover:bg-blue-500 hover:border-blue-500'
                >
                    <FaComment />
                </button>
            </div>

            {/* Zone de signature électronique */}
            {dialog.signature && (
                <div className="mb-6 fixed bottom-14 right-12 z-50 w-64">
                    <div className="border p-4 rounded-lg shadow-lg bg-white">
                        <h2 className="text-md font-semibold mb-3">Electronic Signature</h2>
                        <SignatureCanvas
                            ref={sigCanvas}
                            penColor="black"
                            canvasProps={{ className: 'w-full h-48 border border-gray-300' }}
                        />
                        <div className="mt-4 flex space-x-4">
                            <button
                                onClick={() => {
                                setSignature(undefined)
                                sigCanvas.current?.clear()
                                }}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleSaveSignature}
                                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-500 transition"
                            >
                                Save Signature
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Affichage des versions du document */}
            {dialog.comments && (
                <div className="mb-6 fixed bottom-3 right-14 flex flex-col justify-between z-50 max-w-[700px] max-h-[70%] rounded border shadow-md overflow-hidden bg-gray-50">
                    <div className='shadow-sm h-[40px] p-4 bg-white flex items-center'>
                        <h2 className="text-xl font-semibold">Document Versions</h2>
                    </div>
                    <div className='h-[calc(100%-50px)] w-full overflow-x-hidden overflow-y-auto p-8'>
                        <ul className="space-y-4">
                            {document.versions.map((version: Version, index: number) => (
                                <li key={index} className="bg-white p-4 rounded-lg shadow-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Version {version.versionName}</span>
                                        <span className="text-sm text-gray-600">Created on {version.createdAt}</span>
                                    </div>

                                    {/* Commentaires */}
                                    <div className="mt-4">
                                        <h3 className="font-semibold">Comments</h3>
                                        <ul className="space-y-2 mt-2">
                                            {version.comments.map((comment: Comment) => (
                                                <li key={comment.id} className="text-sm text-gray-700">
                                                    {comment.author}: {comment.text}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Formulaire d'ajout de commentaire */}
                                        <button
                                            onClick={() => setShowCommentForm({ ...showCommentForm, [index]: !showCommentForm[index] })}
                                            className="text-blue-600 hover:underline mt-4"
                                        >
                                            {showCommentForm[index] ? 'Hide Comment Form' : 'Add Comment'}
                                        </button>

                                        {showCommentForm[index] && (
                                            <div className="mt-4 flex space-x-4">
                                                <input
                                                    type="text"
                                                    placeholder="Add a comment..."
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg"
                                                />
                                                <button
                                                    onClick={() => handleAddComment(index)}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                                                >
                                                    Add Comment
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentView;
