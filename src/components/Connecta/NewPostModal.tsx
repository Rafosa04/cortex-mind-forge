
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Image } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewPostModalProps {
  open: boolean;
  onClose: () => void;
  onPost: (content: string, imageUrl?: string) => void;
  userAvatar: string;
  userName: string;
}

export default function NewPostModal({ open, onClose, onPost, userAvatar, userName }: NewPostModalProps) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = () => {
    if (content.trim()) {
      onPost(content, imageUrl || undefined);
      setContent("");
      setImageUrl("");
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulando um upload
      setTimeout(() => {
        // Normalmente aqui enviaria o arquivo para um servidor
        // Por enquanto apenas fingimos que o URL foi gerado
        const fakeUploadedUrl = URL.createObjectURL(file);
        setImageUrl(fakeUploadedUrl);
        setIsUploading(false);
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-foreground">Nova Ideia</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>

            <textarea
              placeholder="Compartilhe uma ideia ou pensamento..."
              className="flex-1 bg-background/50 border-none focus:outline-none resize-none h-32 p-2 rounded-md text-sm placeholder:text-foreground/50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {isUploading && (
            <div className="mt-3 h-10 bg-background/50 rounded animate-pulse flex items-center justify-center">
              <span className="text-xs text-foreground/70">Enviando imagem...</span>
            </div>
          )}

          {imageUrl && (
            <div className="mt-3 relative">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-full h-auto max-h-40 object-cover rounded-md" 
              />
              <button 
                className="absolute top-2 right-2 bg-background/80 rounded-full p-1"
                onClick={() => setImageUrl("")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                type="button" 
                variant="ghost" 
                size="sm"
                className="text-foreground/70 hover:text-foreground"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image size={16} />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handlePost}
                disabled={!content.trim() || isUploading}
                size="sm"
              >
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
