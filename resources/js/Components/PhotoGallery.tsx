import React, {useEffect, useState} from 'react';
import { Modal } from 'react-bootstrap';
import { XCircle, ChevronLeft, ChevronRight, Trash2 } from 'react-feather';

interface PhotoGalleryProps {
    photos: File[];
    show: boolean;
    onHide: () => void;
    setPhotos: (files: File[]) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, show, onHide,setPhotos }) => {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [photoList, setPhotoList] = useState(photos);
    useEffect(() => {
        setPhotoList(photos)
    }, [photos]);
    const renderFilePreview = (file: File) => {
        if (!file) return null;

        const fileType = file.type;

        if (fileType.startsWith('image/')) {
            return <img src={URL.createObjectURL(file)} alt={file.name} className="selected-photo" />;
        } else if (fileType === 'application/pdf') {
            return (
                <div className="file-preview">
                    <embed src={URL.createObjectURL(file)} type="application/pdf" className="file-embed" />
                </div>
            );
        } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
            return (
                <div className="file-preview">
                    <a href={URL.createObjectURL(file)} download={file.name} className="file-link">
                        {file.name}
                    </a>
                </div>
            );
        } else {
            return (
                <div className="file-preview">
                    <a href={URL.createObjectURL(file)} download={file.name} className="file-link">
                        {file.name}
                    </a>
                </div>
            );
        }
    };

    const handlePrev = () => {
        setSelectedPhotoIndex((prevIndex) => (prevIndex === 0 ? photoList.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setSelectedPhotoIndex((prevIndex) => (prevIndex === photoList.length - 1 ? 0 : prevIndex + 1));
    };
    const removePhoto = (index: number) => {
        const updatedPhotos = photoList.filter((_, i) => i !== index);
        setPhotoList(updatedPhotos);
        setPhotos(updatedPhotos);
        if (selectedPhotoIndex >= updatedPhotos.length) {
            setSelectedPhotoIndex(updatedPhotos.length - 1);
        }
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
                    {renderFilePreview(photoList[selectedPhotoIndex])}
                    <button className="nav-button right" onClick={handleNext}>
                        <ChevronRight size={48} />
                    </button>
                </div>
                <div className="thumbnail-carousel">
                    {photoList.map((photo, index) => (
                        <div
                            key={index}
                            className={`thumbnail-item ${selectedPhotoIndex === index ? 'active' : ''}`}
                            onClick={() => setSelectedPhotoIndex(index)}
                        >
                            <img src={URL.createObjectURL(photo)} alt={`Thumbnail ${index}`} className="thumbnail"/>
                            <button className="remove-button z-30" onClick={() => removePhoto(index)}>
                                <Trash2 size={20}/>
                            </button>
                        </div>
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PhotoGallery;
