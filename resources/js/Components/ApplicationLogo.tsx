import React from 'react';

interface ImageProps {
  alt: string;
  className?: string;
}

const ApplicationLogo: React.FC<ImageProps> = ({alt, className }) => {
  return (
    <img
      src="/img/logo.png"
      alt={alt}
      className={className}
    />
  );
};

export default ApplicationLogo;

