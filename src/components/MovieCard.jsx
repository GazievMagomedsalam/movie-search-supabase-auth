export default function MovieCard({ movie, showMovie }) {
  return (
    <div className="cartMovie">
      <div className="cartMovie-info"> 
      <h2>{movie.title}</h2>

      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
        />
      )}

      <p>Рейтинг: {movie.vote_average.toFixed(1)}</p>
      </div>
      <div className="podrobnee">
        <button onClick={() => showMovie(movie.id)} className="buttonCartMovie">Подробнее</button>
      </div>
    </div>
  );
}
