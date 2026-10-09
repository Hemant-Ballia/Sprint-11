"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function MovieManager() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${apiUrl}/movies`);

        if (!res.ok) {
          throw new Error("Failed to fetch movies");
        }

        const data = await res.json();
        setMovies(data.data || []);
      } catch (error) {
        console.error("Movie fetch error:", error);
        setError("Unable to load your movies. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [apiUrl]);

  const createMovie = async (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${apiUrl}/movies`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add movie");
      }

      setMovies((currentMovies) => [data.data, ...currentMovies]);

      setTitle("");
      setDescription("");
      setImage(null);

      const imageInput = document.getElementById("movie-image");

      if (imageInput) {
        imageInput.value = "";
      }
    } catch (error) {
      console.error("Create movie error:", error);
      setError(error.message || "Failed to add movie");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMovie = async (id) => {
    try {
      setError("");

      const res = await fetch(`${apiUrl}/movies/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete movie");
      }

      setMovies((currentMovies) =>
        currentMovies.filter((movie) => movie._id !== id)
      );
    } catch (error) {
      console.error("Delete movie error:", error);
      setError(error.message || "Failed to delete movie");
    }
  };

  return (
    <section className={styles.postManager}>
      <div className={styles.formColumn}>
        <h2 className={styles.sectionHeading}>Add Movie</h2>

        <form className={styles.postForm} onSubmit={createMovie}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="movie-title">Movie Title</label>

            <input
              className={styles.formInput}
              id="movie-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter movie title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="movie-description">Description</label>

            <textarea
              className={styles.formInput}
              id="movie-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter movie description"
              rows="5"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="movie-image">Poster</label>

            <input
              className={styles.formInput}
              id="movie-image"
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files[0] || null)}
            />
          </div>

          <button className={styles.btnPrimary} type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Movie"}
          </button>
        </form>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      <div className={styles.feedColumn}>
        <h2 className={styles.sectionHeading}>My Movies</h2>

        {loading && <div className={styles.postStatus}>Loading movies...</div>}

        {!loading && movies.length === 0 && <div className={styles.postStatus}>No movies found. Start building your collection!</div>}

        {!loading && movies.length > 0 && (
          <div className={styles.postGrid}>
            {movies.map((movie) => (
              <article className={styles.postCard} key={movie._id}>
                {movie.imageUrl && (
                  <div className={styles.postImageContainer}>
                    <img
                      className={styles.postImage}
                      src={movie.imageUrl}
                      alt={movie.title}
                    />
                  </div>
                )}
                
                <div className={styles.postContent}>
                  <h3>{movie.title}</h3>
                  <p>{movie.description}</p>

                  <button className={styles.btnDanger} onClick={() => deleteMovie(movie._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}