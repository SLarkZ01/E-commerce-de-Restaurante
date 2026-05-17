"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageDropzoneProps {
  archivo: File | null;
  onArchivoSeleccionado: (file: File) => void;
  onEliminar: () => void;
  etiqueta?: string;
  relacionAspecto?: string;
  maxTamañoMB?: number;
}

function validarArchivo(file: File, maxTamañoMB: number): string | null {
  if (!file.type.startsWith("image/")) return "Solo se permiten imágenes";
  if (file.size > maxTamañoMB * 1024 * 1024)
    return `La imagen no puede superar los ${maxTamañoMB}MB`;
  return null;
}

export function ImageDropzone({
  archivo,
  onArchivoSeleccionado,
  onEliminar,
  etiqueta = "Imagen",
  relacionAspecto = "16/10",
  maxTamañoMB = 5,
}: ImageDropzoneProps) {
  const [arrastrando, setArrastrando] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => {
    return archivo ? URL.createObjectURL(archivo) : null;
  }, [archivo]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const manejarArchivo = (file: File) => {
    const err = validarArchivo(file, maxTamañoMB);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    onArchivoSeleccionado(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(false);
    const file = e.dataTransfer.files[0];
    if (file) manejarArchivo(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setArrastrando(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) manejarArchivo(file);
  };

  if (archivo && previewUrl) {
    return (
      <div>
        <label className="block text-xs font-medium text-texto-secundario mb-1.5">
          {etiqueta}
        </label>
        <div className="relative group rounded-lg overflow-hidden border border-borde">
          <img
            src={previewUrl}
            alt="Vista previa"
            className="w-full object-cover"
            style={{ aspectRatio: relacionAspecto }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-white/90 hover:bg-white text-texto p-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onEliminar}
              className="bg-white/90 hover:bg-white text-error p-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-texto-secundario mb-1.5">
        {etiqueta}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setArrastrando(false)}
        onClick={() => inputRef.current?.click()}
        className={`w-full rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
          arrastrando
            ? "border-primario bg-primario/5"
            : "border-borde/60 bg-fondo-oscuro hover:border-primario/50 hover:bg-fondo-card"
        } ${error ? "border-error/50 bg-error/5" : ""}`}
        style={{ aspectRatio: relacionAspecto }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${arrastrando ? "bg-primario/10" : "bg-borde/30"}`}>
          <ImageIcon
            className={`w-6 h-6 ${arrastrando ? "text-primario" : "text-texto-terciario"}`}
          />
        </div>
        <div className="text-center space-y-1">
          <span
            className={`block text-sm font-semibold ${arrastrando ? "text-primario" : "text-texto-secundario"}`}
          >
            {arrastrando
              ? "Suelta la imagen aquí"
              : "Arrastra una imagen o haz clic"}
          </span>
          <span className="text-[11px] text-texto-terciario">
            JPG, PNG, WebP (máx. {maxTamañoMB}MB)
          </span>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
