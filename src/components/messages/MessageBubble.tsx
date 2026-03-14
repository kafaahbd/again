"use client";
import React, { useState, useRef, useEffect } from "react";
import { Check, CheckCheck, MoreVertical, Edit2, Trash2, Reply, Smile } from "lucide-react";
import { format } from "date-fns";

import { Message } from "../../types/messages";

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar: boolean;
  profileColor?: string;
  initials?: string;
  onEdit?: (message: Message) => void;
  onDelete?: (messageId: string, forEveryone: boolean) => void;
  onReply?: (message: Message) => void;
  onReact?: (messageId: string, reaction: string) => void;
  repliedMessage?: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  showAvatar,
  profileColor,
  initials,
  onEdit,
  onDelete,
  onReply,
  onReact,
  repliedMessage
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "p");
    } catch (e) {
      return "";
    }
  };

  const isDeleted = message.deleted_for_everyone;

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 mb-1 group relative`}>
      {/* Other User Avatar */}
      {!isMe && (
        <div className="w-8 h-8 flex-shrink-0 mb-5">
          {showAvatar ? (
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shadow-sm transform transition-all"
              style={{ 
                backgroundColor: profileColor || '#10B981',
                background: `linear-gradient(135deg, ${profileColor || '#10B981'} 0%, #059669 100%)`
              }}
            >
              {initials?.toUpperCase()}
            </div>
          ) : (
            <div className="w-8" /> // Spacer to keep messages aligned
          )}
        </div>
      )}

      {/* Context Menu Trigger */}
      {isMe && !isDeleted && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-5 relative flex items-center" ref={menuRef}>
          <button 
            onClick={() => { onReact?.(message.id, '👍'); setShowMenu(false); }}
            className="p-1 text-gray-400 hover:text-amber-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-1"
            title="Like"
          >
            <Smile size={16} />
          </button>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 bottom-full mb-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20">
              <button 
                onClick={() => { onReply?.(message); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
              >
                <Reply size={14} /> Reply
              </button>
              <button 
                onClick={() => { onEdit?.(message); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
              >
                <Edit2 size={14} /> Edit
              </button>
              <button 
                onClick={() => { onDelete?.(message.id, false); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete for me
              </button>
              <button 
                onClick={() => { onDelete?.(message.id, true); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete for everyone
              </button>
            </div>
          )}
        </div>
      )}

      <div className={`max-w-[80%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Replied Message Preview */}
        {repliedMessage && !isDeleted && (
          <div className={`mb-1 px-3 py-2 text-xs rounded-xl border-l-4 ${
            isMe 
              ? 'bg-emerald-700/30 border-emerald-400 text-emerald-50' 
              : 'bg-gray-100 dark:bg-gray-700/50 border-gray-400 dark:border-gray-500 text-gray-600 dark:text-gray-300'
          }`}>
            <p className="font-semibold mb-0.5 opacity-80">
              {(isMe ? repliedMessage.sender_id === message.sender_id : repliedMessage.sender_id !== message.sender_id) ? "You" : "Them"}
            </p>
            <p className="truncate opacity-90">
              {repliedMessage.deleted_for_everyone ? "This message was removed" : repliedMessage.message_text}
            </p>
          </div>
        )}

        {/* Message Content */}
        <div className={`px-4 py-2.5 text-sm transition-all duration-200 relative ${
          isDeleted
            ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 italic rounded-2xl border border-gray-200/50 dark:border-gray-700/30'
            : isMe 
              ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl rounded-tr-none shadow-md shadow-emerald-500/10 font-medium' 
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700/50 shadow-sm'
        }`}>
          <p className="leading-relaxed break-words">
            {isDeleted ? "This message was removed" : message.message_text}
          </p>
          
          {/* Reactions */}
          {message.reactions && Object.keys(message.reactions).length > 0 && !isDeleted && (
            <div className={`absolute -bottom-3 ${isMe ? 'right-2' : 'left-2'} bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 px-1.5 py-0.5 flex items-center gap-1 z-10`}>
              {Array.from(new Set(Object.values(message.reactions))).map((reaction, idx) => (
                <span key={idx} className="text-xs">{reaction}</span>
              ))}
              {Object.keys(message.reactions).length > 1 && (
                <span className="text-[10px] text-gray-500 font-medium ml-0.5">{Object.keys(message.reactions).length}</span>
              )}
            </div>
          )}
        </div>

        {/* Message Meta Info */}
        <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
          {isMe && !isDeleted && (
            <span className="flex items-center">
              {message.status === 'seen' ? (
                <CheckCheck size={14} className="text-emerald-500" />
              ) : message.status === 'delivered' ? (
                <CheckCheck size={14} className="text-gray-400" />
              ) : (
                <Check size={14} className="text-gray-400" />
              )}
            </span>
          )}
          <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
            {formatTime(message.created_at)}
            {message.is_edited && !isDeleted && <span>• Edited</span>}
          </span>
        </div>
      </div>

      {/* Context Menu Trigger for Receiver */}
      {!isMe && !isDeleted && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-5 relative flex items-center" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreVertical size={16} />
          </button>
          <button 
            onClick={() => { onReact?.(message.id, '👍'); setShowMenu(false); }}
            className="p-1 text-gray-400 hover:text-amber-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ml-1"
            title="Like"
          >
            <Smile size={16} />
          </button>
          
          {showMenu && (
            <div className="absolute left-0 bottom-full mb-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20">
              <button 
                onClick={() => { onReply?.(message); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
              >
                <Reply size={14} /> Reply
              </button>
              <button 
                onClick={() => { onDelete?.(message.id, false); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete for me
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;