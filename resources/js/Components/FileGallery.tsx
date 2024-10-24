import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { XCircle, ChevronLeft, ChevronRight, Trash2, File } from 'react-feather';
import { TicketFileProps } from "@/types/globalProps";

interface PhotoGalleryProps {
    files: TicketFileProps[];
    show: boolean;
    onHide: () => void;
    setFiles: (files: TicketFileProps[]) => void;
    setSelectedFile: number;
}

const FileGallery: React.FC<PhotoGalleryProps> = ({ files, show, onHide, setFiles, setSelectedFile }) => {
    const [selectedFileId, setSelectedFileId] = useState<number>(setSelectedFile);
    const [fileList, setFileList] = useState(files);
    const visibleThumbnailsCount = 7; // Görünür küçük resim sayısı

    useEffect(() => {
        setFileList(files);
        if (files.length > 0 && selectedFileId === null) {
            setSelectedFileId(files[0].id);
        }
    }, [files]);
    useEffect(() => {
        setSelectedFileId(setSelectedFile)
    }, [setSelectedFile]);
    const renderFilePreview = (file: TicketFileProps) => {
        if (!file) return null;

        const fileType = file.mime_type;
        const filePath = `/uploads/${file.media_id}/${file.filename}`;

        if (fileType.startsWith('image/')) {
            return <img src={filePath} alt={file.filename} className="selected-photo" />;
        } else if (fileType === 'application/pdf') {
            return (
                <div className="file-preview" >
                    <embed src={filePath} type="application/pdf" className="file-embed" style={{minHeight: '60vh'}}/>
                </div>
            );
        } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('officedocument')) {
            const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + filePath)}&embedded=true`;
            return (
                <div className="file-preview">
                    <iframe src={googleDocsUrl} width="100%" height="600px" style={{ border: 'none' }}></iframe>
                </div>
            );
        } else {
            return (
                <div className="file-preview">
                    <a href={filePath} download={file.filename} className="file-link">
                        {file.filename}
                    </a>
                </div>
            );
        }
    };

    const handlePrev = () => {
        const currentIndex = fileList.findIndex(file => file.id === selectedFileId);
        if (currentIndex === 0) {
            setSelectedFileId(fileList[fileList.length - 1].id);
        } else {
            setSelectedFileId(fileList[currentIndex - 1].id);
        }
    };

    const handleNext = () => {
        const currentIndex = fileList.findIndex(file => file.id === selectedFileId);
        if (currentIndex === fileList.length - 1) {
            setSelectedFileId(fileList[0].id);
        } else {
            setSelectedFileId(fileList[currentIndex + 1].id);
        }
    };

    const removeFile = (id: number) => {
        const updatedFiles = fileList.filter((file) => file.id !== id);
        setFileList(updatedFiles);
        setFiles(updatedFiles);
        if (selectedFileId === id) {
            setSelectedFileId(updatedFiles.length > 0 ? updatedFiles[0].id : 0);
        }
    };

    const getVisibleThumbnails = () => {
        if (selectedFileId === null) return [];

        const currentIndex = fileList.findIndex(file => file.id === selectedFileId);
        const start = Math.max(0, currentIndex - Math.floor(visibleThumbnailsCount / 2));
        const end = Math.min(fileList.length, start + visibleThumbnailsCount);

        return fileList.slice(start, end);
    };
    const nameShorter = (name:string, l: number) =>{
        if (name.length<l) return name;
        return name.substring(0,l)+ '...';
    };
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Bestanden & Foto's</Modal.Title>
            </Modal.Header>
            <button
                type="button"
                className="btn-camera-hide"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={onHide}
            >
                <XCircle className={'m-0 text-white'} size={30}></XCircle>
            </button>
            <Modal.Body>
                <div className="selected-photo-container">
                    <button className="nav-button left" onClick={handlePrev}>
                        <ChevronLeft size={48} />
                    </button>
                    {fileList.length > 0 && renderFilePreview(fileList.find(file => file.id === selectedFileId)!)}
                    <button className="nav-button right" onClick={handleNext}>
                        <ChevronRight size={48} />
                    </button>
                </div>
                <div className="thumbnail-carousel">
                    {getVisibleThumbnails().map((file) => (
                        <div
                            key={file.id}
                            className={`thumbnail-item ${selectedFileId === file.id ? 'active' : ''}`}
                            onClick={() => setSelectedFileId(file.id)}
                        >
                            {file.mime_type.includes('image') ?
                                <img src={`/uploads/${file.media_id}/${file.filename}`} alt={`Thumbnail ${file.id}`}
                                     className="thumbnail"/> : <span className={'file-icon'}> <File size={80}/> {nameShorter(file.filename, 10)} </span>}
                            <button className="remove-button z-30" onClick={() => removeFile(file.id)}>
                            <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default FileGallery;
