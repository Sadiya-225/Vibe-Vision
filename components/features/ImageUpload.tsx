"use client";

import { useState, useCallback, ChangeEvent, DragEvent } from "react";
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { isValidImageFile, formatFileSize } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File | string) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload");

  const handleFile = useCallback((file: File) => {
    setError(null);

    if (!isValidImageFile(file)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onImageSelect(file);
  }, [onImageSelect]);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = () => {
    setError(null);

    if (!imageUrl.trim()) {
      setError("Please enter a valid image URL");
      return;
    }

    try {
      new URL(imageUrl);
      setPreview(imageUrl);
      onImageSelect(imageUrl);
    } catch {
      setError("Please enter a valid URL");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setImageUrl(text);
    } catch (err) {
      setError("Failed to read from clipboard");
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setImageUrl("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Method Selector */}
      <div className="flex gap-4 justify-center" role="tablist" aria-label="Upload method">
        <button
          role="tab"
          aria-selected={uploadMethod === "upload"}
          onClick={() => setUploadMethod("upload")}
          className={`px-6 py-3 rounded-full transition-all ${
            uploadMethod === "upload"
              ? "glass-strong text-white glow-blue"
              : "glass text-white/60 hover:text-white"
          }`}
        >
          <Upload className="w-5 h-5 inline mr-2" aria-hidden="true" />
          Upload / Drop
        </button>
        <button
          role="tab"
          aria-selected={uploadMethod === "url"}
          onClick={() => setUploadMethod("url")}
          className={`px-6 py-3 rounded-full transition-all ${
            uploadMethod === "url"
              ? "glass-strong text-white glow-blue"
              : "glass text-white/60 hover:text-white"
          }`}
        >
          <LinkIcon className="w-5 h-5 inline mr-2" aria-hidden="true" />
          Image URL
        </button>
      </div>

      {/* Upload Area */}
      {uploadMethod === "upload" ? (
        <GlassCard
          className={`relative transition-all ${
            dragActive ? "glow-blue border-blue-500" : ""
          }`}
        >
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="relative"
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleChange}
              aria-label="Upload image file"
            />

            {!preview ? (
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center py-12 cursor-pointer"
              >
                <Upload
                  className="w-16 h-16 text-blue-400 mb-4"
                  aria-hidden="true"
                />
                <p className="text-xl text-white mb-2">
                  Drop an Image Here or Click to Browse
                </p>
                <p className="text-sm text-white/60">
                  Supports JPEG, PNG, GIF, WebP (Max 10MB)
                </p>
              </label>
            ) : (
              <div className="relative">
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 p-2 rounded-full glass-strong hover:bg-red-500/20 transition-colors z-10"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={preview}
                    alt="Preview of uploaded image"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      ) : (
        <GlassCard>
          <div className="space-y-4">
            <label htmlFor="image-url" className="block text-white text-sm font-medium mb-2">
              Enter Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Image URL"
              />
              <button
                onClick={handlePaste}
                className="px-4 py-3 rounded-lg glass hover:glass-strong transition-all text-white"
                aria-label="Paste from clipboard"
              >
                Paste
              </button>
            </div>

            {imageUrl && !preview && (
              <Button variant="primary" onClick={handleUrlSubmit} className="w-full">
                Load Image
              </Button>
            )}

            {preview && (
              <div className="relative">
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 p-2 rounded-full glass-strong hover:bg-red-500/20 transition-colors z-10"
                  aria-label="Remove image"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="relative w-full h-64 rounded-lg overflow-hidden mt-4">
                  <Image
                    src={preview}
                    alt="Preview of image from URL"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="glass-strong border-red-500/50 rounded-lg p-4 text-red-300"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  );
}
