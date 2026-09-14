import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";
import AuthForm from "./components/AuthForm.jsx";
import MovieList from "./components/MovieList.jsx";
import MovieDetails from "./components/MovieDetails.jsx";
import { getTotalPages } from "./utils.js";
import "./App.css";

const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export default function App() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [session, setSession] = useState(null);

  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 5;

  const filteredMovies = [...movies]
    .filter((movie) => {
      if (!year) return true;

      return movie.release_date?.startsWith(year);
    })
    .filter((movie) => {
      if (!minRating) return true;

      return movie.vote_average >= Number(minRating);
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.vote_average - a.vote_average;
      }

      if (sortBy === "date") {
        return new Date(b.release_date) - new Date(a.release_date);
      }

      return 0;
    });

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;

  const currentMovies = filteredMovies.slice(startIndex, endIndex);

  const totalPages = getTotalPages(filteredMovies.length, moviesPerPage);

  async function signUp() {
    setAuthMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    if (data.user) {
      setAuthMessage("Регистрация прошла успешно.");
    }
  }

  async function signIn() {
    setAuthMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthMessage(error.message);
      return;
    }

    setAuthMessage("Вход выполнен");
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setAuthMessage(error.message);
    }
  }

  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setAuthMessage(error.message);
        return;
      }

      setSession(data.session);
    }

    loadSession();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  function clearSearch() {
    setSearch("");
    setMovies([]);
    setSelectedMovie(null);
    setTrailer(null);

    setYear("");
    setMinRating("");
    setSortBy("default");

    setCurrentPage(1);
    setError(false);
  }

  async function searchMovies() {
    setLoading(true);
    setError(false);
    setSelectedMovie(null);
    setTrailer(null);
    setCurrentPage(1);

    try {
      if (!search.trim()) return;

      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          search,
        )}&language=ru-RU`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            accept: "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Ошибка поиска");
      }

      const data = await res.json();

      setMovies(data.results.slice(0, 10));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  async function showMovie(id) {
    setLoading(true);
    setError(false);
    setTrailer(null);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=ru-RU&append_to_response=videos`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            accept: "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Ошибка загрузки фильма");
      }

      const data = await res.json();

      setSelectedMovie(data);

      const trailerVideo = data.videos.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer",
      );

      if (trailerVideo) {
        setTrailer(trailerVideo.key);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function closeMovie() {
    setSelectedMovie(null);
    setTrailer(null);
  }

  return (
    <main>
      {!session && (
        <AuthForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          signUp={signUp}
          signIn={signIn}
          authMessage={authMessage}
        />
      )}

      {session && (
        <>
          <div className="auth">
            <p>Вы вошли как: {session.user.email}</p>
            <button onClick={signOut}>Выйти</button>
          </div>

          <h1>Поиск фильмов</h1>

          <div className="movie-content">
            <input
              type="text"
              placeholder="Например: Интерстеллар"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  searchMovies();
                }
              }}
            />

            <button onClick={searchMovies}>Найти</button>

            <button onClick={clearSearch}>Очистить</button>
          </div>

          {movies.length > 0 && (
            <div className="filters">
              <input
                type="number"
                placeholder="Год"
                value={year}
                onChange={(event) => {
                  setYear(event.target.value);
                  setCurrentPage(1);
                }}
              />

            </div>
          )}

          {loading && <p>Загрузка...</p>}

          {error && <p>Произошла ошибка</p>}

          {!selectedMovie && (
            <MovieList movies={currentMovies} showMovie={showMovie} />
          )}

          {!selectedMovie && filteredMovies.length > 0 && (
            <div>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Назад
              </button>

              <span>
                Страница {currentPage} из {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Вперёд
              </button>
            </div>
          )}
          {selectedMovie && (
            <MovieDetails
              selectedMovie={selectedMovie}
              trailer={trailer}
              closeMovie={closeMovie}
            />
          )}
        </>
      )}
    </main>
  );
}
