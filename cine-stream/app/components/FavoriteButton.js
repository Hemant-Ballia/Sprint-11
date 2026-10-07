"use client";

import { useState } from "react";

export default function FavoriteButton() {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <button 
      onClick={toggleFavorite} 
      className={isFavorite ? "btn-favorite active" : "btn-favorite"}
    >
      {isFavorite ? "♥ Favorited" : "♡ Add to Favorites"}
    </button>
  );
}