import React from 'react';

interface SmallCardProps {
  title: string;
  children: React.ReactNode;
}

const SmallCard: React.FC<SmallCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xs w-full mx-auto my-4 border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
      {children}
    </div>
  );
};

export default SmallCard;
