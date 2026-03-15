"use client";
import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, X, Edit2, Reply, Image as ImageIcon, Loader2 } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import "./haram-emojis.css";
import { Message } from "../../types/messages";
import { useAuth } from "../../contexts/AuthContext";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  onSend: (e: React.FormEvent, imageUrl?: string) => void;
  onTyping: () => void;
  lang: string;
  replyingToMessage?: Message | null;
  editingMessage?: Message | null;
  onCancelReply?: () => void;
  onCancelEdit?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSend,
  onTyping,
  lang,
  replyingToMessage,
  editingMessage,
  onCancelReply,
  onCancelEdit
}) => {
  const { api } = useAuth();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        alert(lang === "bn" ? "ছবির সাইজ ৫ মেগাবাইটের বেশি হতে পারবে না।" : "Image size cannot exceed 5MB.");
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert(lang === "bn" ? "শুধুমাত্র JPG, PNG এবং WEBP ছবি সাপোর্ট করে।" : "Only JPG, PNG, and WEBP images are supported.");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;

    let imageUrl: string | undefined = undefined;

    if (imageFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = response.data.imageUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(lang === "bn" ? "ছবি আপলোড করতে সমস্যা হয়েছে।" : "Failed to upload image.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onSend(e, imageUrl);
    removeImage();
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-3 md:p-4 bg-white dark:bg-[#0B1120] border-t border-gray-100 dark:border-gray-800/60 flex flex-col gap-2 relative">
      {/* Reply Preview */}
      {replyingToMessage && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border-l-4 border-emerald-500 text-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <Reply size={16} className="text-emerald-500 flex-shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Replying to:</span>
              <span className="text-gray-500 dark:text-gray-400 truncate">{replyingToMessage.message_text}</span>
            </div>
          </div>
          <button onClick={onCancelReply} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Edit Preview */}
      {editingMessage && (
        <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/10 p-2 rounded-xl border-l-4 border-amber-500 text-sm">
          <div className="flex items-center gap-2 overflow-hidden">
            <Edit2 size={16} className="text-amber-500 flex-shrink-0" />
            <div className="truncate">
              <span className="font-semibold text-amber-700 dark:text-amber-500 mr-2">Editing message:</span>
              <span className="text-amber-600/80 dark:text-amber-400/80 truncate">{editingMessage.message_text}</span>
            </div>
          </div>
          <button onClick={onCancelEdit} className="p-1 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 rounded-full">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full right-4 mb-2 z-50" ref={emojiPickerRef}>
          <EmojiPicker 
            onEmojiClick={onEmojiClick}
            theme={Theme.AUTO}
            lazyLoadEmojis={true}
          />
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative inline-block mb-2 max-w-[200px]">
          <img src={imagePreview} alt="Preview" className="rounded-xl border border-gray-200 dark:border-gray-700 max-h-[150px] object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 md:gap-3 max-w-7xl mx-auto w-full">
        
        {/* Image Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors duration-200"
          disabled={isUploading}
        >
          <ImageIcon size={22} />
        </button>
        <input
          type="file"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Text Input Container */}
        <div className="flex-1 relative group">
          <input
            type="text"
            placeholder={lang === "bn" ? "আপনার মেসেজ লিখুন..." : "Type your message..."}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm md:text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all duration-200"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              onTyping();
            }}
          />
          
          {/* Emoji Button */}
          <button 
            type="button" 
            ref={emojiButtonRef}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors duration-200"
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!newMessage.trim() && !imageFile) || isUploading}
          className={`p-3.5 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center ${
            (newMessage.trim() || imageFile) && !isUploading
              ? 'bg-gradient-to-tr from-[#0084ff] to-blue-500 text-white shadow-blue-500/20 hover:scale-105 active:scale-95' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-60'
          }`}
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} className={newMessage.trim() || imageFile ? 'translate-x-0.5 -translate-y-0.5 rotate-12' : ''} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;