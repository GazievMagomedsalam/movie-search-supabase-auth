export default function MovieDetails({ selectedMovie, trailer, closeMovie }) {
  return (
    <section className="section-movie">
      <h2>{selectedMovie.title}</h2>

      {selectedMovie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
          alt={selectedMovie.title}
        />
      )}

      <p>Рейтинг: {selectedMovie.vote_average.toFixed(1)} / 10</p>

      <p>Дата выхода: {selectedMovie.release_date}</p>

      <p>{selectedMovie.overview || "Описание отсутствует"}</p>

      {trailer && (
        <div className="movie">
          <iframe
            width="720"
            height="360"
            src={`https://www.youtube.com/embed/${trailer}`}
            title="Трейлер"
            allowFullScreen
          />

          <button onClick={closeMovie} className="buttonClose">Закрыть</button>
        </div>
      )}
    </section>
  );
}
