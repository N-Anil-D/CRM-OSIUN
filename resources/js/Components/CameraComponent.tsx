import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {Camera, CameraOff, CheckCircle, XCircle} from "react-feather";
import PhotoGallery from "@/Components/PhotoGallery";
export interface CameraProps {
    cameraStatus: boolean;
    onHide: () => void;
    setCapturedFiles: (files: File[]) => void;
    otherFiles: File[];
}

const CameraComponent: React.FC<CameraProps> = ({ cameraStatus, onHide, setCapturedFiles, otherFiles }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [photos, setPhotos] = useState<File[]>(otherFiles??[]);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        if (cameraStatus) {
            const startCamera = async () => {
                try {
                    const constraints = {
                        video: {
                            width: { ideal: 1080 },
                            height: { ideal: 1920 }
                        }
                    };
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error("Error accessing camera:", error);
                }
            };
            startCamera().catch((err) => alert('Camera not available\n' + err));
        }

        return () => {
            stopCamera();
        };
    }, [cameraStatus]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };
    const takePhoto = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            const videoWidth = videoRef.current.videoWidth;
            const videoHeight = videoRef.current.videoHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            if (context) {
                context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
                        setPhotos((prevPhotos) => [...prevPhotos, file]);
                    }
                }, 'image/jpeg');
            }
        }
    };
    const handleOnay = () => {
        setCapturedFiles(photos);
        onHide();
    };

    return (
        <>
            <Modal show={cameraStatus} onHide={onHide} className={'z-40'} size="xl" centered>
                <div role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-xl-12">
                                    <video ref={videoRef} width="100%" height="auto" autoPlay/>
                                    <div className="camera-controls">
                                        <button
                                            type="button"
                                            className="btn-camera-hide"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                            onClick={onHide}
                                        >
                                            <XCircle className={'m-0 text-white'} size={30}></XCircle>
                                        </button>
                                        <button className="shutter-button" onClick={takePhoto}>
                                            <Camera className='m-2 ml-1' size={40}/>
                                        </button>
                                        <button className="check-button" onClick={handleOnay}>
                                            <CheckCircle className='m-2' size={40}/>
                                        </button>
                                        {photos.length > 0 && (
                                            <div className="gallery-button-container">
                                                {photos.length > 1 && <span
                                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {photos.length.toString()}
                                                    <span className="visually-hidden">unread messages</span>
                                        </span>}
                                                <img
                                                    src={URL.createObjectURL(photos[0])}
                                                    alt="First Captured"
                                                    className="gallery-thumbnail"
                                                    onClick={() => setShowGallery(!showGallery)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <canvas ref={canvasRef} style={{display: 'none'}} width="1080"
                                            height="1920"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <PhotoGallery photos={photos} show={showGallery} onHide={() => setShowGallery(false)} setPhotos={setPhotos}/>
        </>
    );
};

export default CameraComponent;
