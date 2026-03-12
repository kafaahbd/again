"use client";
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TextExpanderProps {
    text: string;
    limit: number;
    className?: string;
}

const TextExpander: React.FC<TextExpanderProps> = ({ text, limit, className = "" }) => {
    const { lang } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const words = text.split(' ');
    
    if (words.length <= limit) {
        return <p className={className}>{text}</p>;
    }

    const displayText = isExpanded ? text : words.slice(0, limit).join(' ') + '...';

    return (
        <div className={className}>
            <p className="inline whitespace-pre-wrap">
                {displayText}
            </p>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }} 
                className="text-blue-500 font-bold text-xs ml-1 hover:underline inline-block"
            >
                {isExpanded ? (lang === 'bn' ? 'কম দেখুন' : 'See less') : (lang === 'bn' ? 'আরও দেখুন' : 'See more')}
            </button>
        </div>
    );
};

export default TextExpander;
