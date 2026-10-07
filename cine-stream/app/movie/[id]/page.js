import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "../../components/FavoriteButton"; 

async function getMovie(id) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      accept: "application/json"
    }
  });
  
  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) {
    return {
      title: "Movie Not Found | Cine-Stream",
    };
  }

  return {
    title: `${movie.title} | Cine-Stream`,
    description: movie.overview || "View movie details on Cine-Stream.",
  };
}

export default async function MovieDetails({ params }) {
  const { id } = await params;
  const movie = await getMovie(id);

  if (!movie) {
    return <main className="container">Error loading movie details...</main>;
  }

  return (
    <main className="container">
      <Link href="/movie" className="back-link">← Back to Movies</Link>
      
      <div className="movie-details-layout">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={300}
          height={450}
          className="movie-image"
        />
        <div className="details-info">
          <h1>{movie.title}</h1>
          <p className="tagline">{movie.tagline}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
          <div className="overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
          <FavoriteButton />
        </div>
      </div>
    </main>
  );
}