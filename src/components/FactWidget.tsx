
import React from "react";

export const FactWidget = () => {
  // This will eventually be pulled from an API or database
  const fact = {
    title: "Vitamin D",
    content: "Vitamin D is both a nutrient we eat and a hormone our bodies produce. It's essential for strong bones, supporting the immune system, and helping muscles function properly.",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
  };

  return (
    <div className="flex flex-col h-full">
      <div className="rounded-xl overflow-hidden h-48 mb-4">
        <img
          src={fact.imageUrl}
          alt={fact.title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{fact.title}</h3>
      <p className="text-gray-400 text-sm flex-grow">{fact.content}</p>
      
      <div className="mt-4">
        <button className="text-blue-400 text-sm hover:text-blue-300 transition">
          Read more
        </button>
      </div>
    </div>
  );
};
