"use client";
import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title }) => {
  useEffect(() => {
    if (title) {
      const siteTitle = "Kafa'ah Study Corner";
      document.title = `${title} | ${siteTitle}`;
    }
  }, [title]);

  return null;
};

export default SEO;