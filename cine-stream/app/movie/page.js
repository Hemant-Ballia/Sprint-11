import Image from "next/image";
import Link from "next/link";

export default async function MoviesPage() {
  const apiToken = process.env.TMDB_API_KEY;
  
  const response = await fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", {
    headers: {
      Authorization: `Bearer ${apiToken}`,
      accept: "application/json"
    }
  });

  if (!response.ok) {
    return <main className="container">Error loading movies...</main>;
  }

  const data = await response.json();
  const movies = data.results || [];

  return (
    <main className="container">
      <h1>Popular Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={200}
              height={300}
              className="movie-image"
            />
            <h3>{movie.title}</h3>
            <Link href={`/movie/${movie.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </main>
  );
}