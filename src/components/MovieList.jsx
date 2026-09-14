import MovieCard from "./MovieCard.jsx";

export default function MovieList({ movies, showMovie }) {
  return (
    <>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} showMovie={showMovie} />
      ))}
    </>
  );
}
