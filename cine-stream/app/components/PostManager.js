"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function PostManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [image, setImage] = useState(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${apiUrl}/posts`);

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Post fetch error:", error);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [apiUrl]);

  const createPost = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim() || !authorId.trim()) {
      setError("Title, content and author ID are required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("content", content);
      formData.append("authorId", authorId);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`${apiUrl}/posts`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      setPosts((currentPosts) => [data.data, ...currentPosts]);

      setTitle("");
      setContent("");
      setAuthorId("");
      setImage(null);

      const imageInput = document.getElementById("post-image");

      if (imageInput) {
        imageInput.value = "";
      }
    } catch (error) {
      console.error("Create post error:", error);
      setError(error.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  const deletePost = async (id) => {
    try {
      setError("");

      const res = await fetch(`${apiUrl}/posts/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete post");
      }

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== id)
      );
    } catch (error) {
      console.error("Delete post error:", error);
      setError(error.message || "Failed to delete post");
    }
  };

  return (
    <section className={styles.postManager}>
      <div className={styles.formColumn}>
        <h2 className={styles.sectionHeading}>Create Post</h2>

        <form className={styles.postForm} onSubmit={createPost}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="post-title">Title</label>

            <input
              className={styles.formInput}
              id="post-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="post-content">Content</label>

            <textarea
              className={styles.formInput}
              id="post-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Enter post content"
              rows="5"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="post-author">Author ID</label>

            <input
              className={styles.formInput}
              id="post-author"
              type="text"
              value={authorId}
              onChange={(event) => setAuthorId(event.target.value)}
              placeholder="Enter MongoDB user ID"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="post-image">Image</label>

            <input
              className={styles.formInput}
              id="post-image"
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files[0] || null)}
            />
          </div>

          <button className={styles.btnPrimary} type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Post"}
          </button>
        </form>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      <div className={styles.feedColumn}>
        <h2 className={styles.sectionHeading}>Posts</h2>

        {loading && <div className={styles.postStatus}>Loading posts...</div>}

        {!loading && posts.length === 0 && <div className={styles.postStatus}>No posts found.</div>}

        {!loading && posts.length > 0 && (
          <div className={styles.postGrid}>
            {posts.map((post) => (
              <article className={styles.postCard} key={post._id}>
                {post.imageUrl && (
                  <div className={styles.postImageContainer}>
                    <img
                      className={styles.postImage}
                      src={post.imageUrl}
                      alt={post.title}
                    />
                  </div>
                )}
                
                <div className={styles.postContent}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>

                  {post.authorId && post.authorId.name ? (
                    <p className={styles.postAuthor}>
                      By {post.authorId.name} {post.authorId.email ? `(${post.authorId.email})` : ''}
                    </p>
                  ) : (
                    <p className={styles.postAuthor}>By Unknown Author</p>
                  )}

                  <button className={styles.btnDanger} onClick={() => deletePost(post._id)}>
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