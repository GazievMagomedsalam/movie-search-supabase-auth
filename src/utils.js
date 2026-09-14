



export function getTotalPages(totalMovies, moviesPerPage) {
  return Math.ceil(totalMovies / moviesPerPage);
}