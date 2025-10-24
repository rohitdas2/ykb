import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import '../styles/ImageCropper.css';

const ImageCropper = ({
  imageSrc,
  onCropComplete,
  onCancel,
  aspect = 1,
  cropShape = 'rect',
  title = 'Crop Image'
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropChange = (crop) => {
    setCrop(crop);
  };

  const handleZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const handleCropAreaChange = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          onCropComplete(blob);
        }, 'image/jpeg', 0.9);
      };
      img.src = imageSrc;
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <div className="image-cropper-modal">
      <div className="image-cropper-overlay" onClick={onCancel}></div>
      <div className="image-cropper-container">
        <div className="image-cropper-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <div className="cropper-wrapper">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={true}
            onCropChange={handleCropChange}
            onCropAreaChange={handleCropAreaChange}
            onZoomChange={handleZoomChange}
            restrictPosition={true}
            classes={{
              containerClassName: 'cropper-container',
              mediaClassName: 'cropper-media',
              cropAreaClassName: 'crop-area'
            }}
          />
        </div>

        <div className="cropper-controls">
          <div className="zoom-control">
            <label>Zoom:</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              className="zoom-slider"
            />
            <span className="zoom-value">{zoom.toFixed(1)}x</span>
          </div>
        </div>

        <div className="image-cropper-footer">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="save-button" onClick={handleSaveCrop}>Save & Crop</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
