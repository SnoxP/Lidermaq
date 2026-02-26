import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title = "Lidermaq Equipamentos | Máquinas e Móveis Industriais em Picos-PI", 
  description = "Lidermaq Equipamentos: Soluções completas em máquinas para padarias, restaurantes, açougues e supermercados. Tradição e qualidade em Picos e região.",
  image = "https://ais-pre-3kkzkpl4snegbmdmslezc2-60270630702.us-west1.run.app/og-image.jpg",
  url = "https://ais-pre-3kkzkpl4snegbmdmslezc2-60270630702.us-west1.run.app",
  type = "website"
}) => {
  const siteTitle = title.includes("Lidermaq") ? title : `${title} | Lidermaq Equipamentos`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name='description' content={description} />
      
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content="Lidermaq" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
