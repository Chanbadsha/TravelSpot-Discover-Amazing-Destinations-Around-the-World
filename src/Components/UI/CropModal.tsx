"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { FiCheck, FiLoader, FiX } from "react-icons/fi";

interface CropModalProps {
  imageUrl: string;
  aspect?: number;
  onCropComplete: (croppedFile: File) => void;
  onClose: () => void;
}

function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  fileName: string,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas to Blob failed"));
        },
        "image/jpeg",
        0.9,
      );
    };
    image.onerror = () => reject(new Error("Failed to load image"));
  });
}

export default function CropModal({
  imageUrl,
  aspect = 16 / 10,
  onCropComplete,
  onClose,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileNameRef = useRef(imageUrl.split("/").pop() || "cropped.jpg");

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((z: number) => {
    setZoom(z);
  }, []);

  const onCropAreaChange = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        fileNameRef.current,
      );
      const file = new File([blob], fileNameRef.current, {
        type: "image/jpeg",
      });
      onCropComplete(file);
    } catch {
      onCropComplete(new File([], fileNameRef.current)); // fallback - will fail upstream
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-(--card) border border-(--border) rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--border)">
          <h3 className="text-base font-bold text-foreground">Crop Image</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:text-(--foreground) hover:bg-(--background) transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Cropper */}
        <div className="relative w-full h-[400px] bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaChange}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-(--border)">
          <span className="text-xs text-(--muted-foreground) shrink-0">
            Zoom
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-(--primary) cursor-pointer"
          />
          <span className="text-xs text-(--muted-foreground) shrink-0 w-8 text-right">
            {zoom.toFixed(1)}x
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-(--border)">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-(--border) text-sm font-medium text-foreground hover:bg-(--background) transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className="px-5 py-2.5 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-white text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <FiLoader className="text-sm animate-spin" /> Cropping...
              </>
            ) : (
              <>
                <FiCheck className="text-sm" /> Apply
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
