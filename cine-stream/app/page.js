import Link from "next/link";
import Image from "next/image";
import PostManager from "./components/PostManager";

async function getPopularMovies() {
  const res = await fetch(
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return res.json();
}

export default async function Home() {
  const data = await getPopularMovies();
  const movies = data.results || [];

  return (
    <div>
      <h1 className="section-heading">Popular Movies</h1>

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

            <Link href={`/movie/${movie.id}`}>
              View Details
            </Link>
          </div>
        ))}
      </div>

      <PostManager />
    </div>
  );
}