import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
const KEY = "ad1a8d6";
function App() {
  const [bookmarkedMovies, setBookmarkedMovies] = useLocalStorage(
    [],
    "bookmarked"
  );

  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState();
  const [error, setError] = useState("");

  function handleAddBookmarked(newBookmarkMovie) {
    console.log(bookmarkedMovies);
    setBookmarkedMovies((bookmarked) => [...bookmarked, newBookmarkMovie]);
  }

  function handleRemoveBookmark(movieId) {
    setBookmarkedMovies(
      bookmarkedMovies.filter(
        (bookmarkedMovie) => bookmarkedMovie.imdbID !== movieId
      )
    );
  }

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  useEffect(
    function () {
      localStorage.setItem("bookmarked", JSON.stringify(bookmarkedMovies));
    },
    [bookmarkedMovies]
  );

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") {
            setMovies([]);
            setError("Movie Not Found");
            return;
          }

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      getMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <div className="relative bg-slate-600 h-content ">
      <Navbar>
        <Logo>Movify</Logo>
        <Search query={query} setQuery={setQuery} />
        <Results movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {!isLoading && error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              handleAddBookmarked={handleAddBookmarked}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              bookmarkedMovies={bookmarkedMovies}
              key={selectedId}
            />
          ) : (
            <BookMarkedMovieList
              bookmarkedMovies={bookmarkedMovies}
              handleRemoveBookmark={handleRemoveBookmark}
            />
          )}
        </Box>
      </Main>
    </div>
  );
}

function Main({ children }) {
  return (
    <div className=" bg-slate-600 pt-4 text-center h-screen w-screen flex flex-row gap-14 justify-center ">
      {children}
    </div>
  );
}

function Navbar({ children }) {
  return (
    <div className="mt-6 rounded-2xl h-20 w-[95%] m-auto   grid grid-cols-3 bg-rose-700 items-center shadow-4xl px-16">
      {children}
    </div>
  );
}

function Logo({ children }) {
  return (
    <div className="items-center logo-container flex flex-row ">
      <span className="justify-self-end text-4xl mb-5"> &#x1F4F7;</span>
      <span className="text-2xl text-white font-semibold italic">
        {children}
      </span>
    </div>
  );
}
function Results({ movies }) {
  return (
    <p className="text-lg text-white justify-self-end">
      {movies.length} Results Found
    </p>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-72 text-sm text-black p-3 shadow-2xl bg-slate-200 focus:outline-none focus:border-2 focus:bg-slate-300  focus:ring rounded-2xl justify-self-center border-black border-1"
      placeholder="Search Movies...."
      type="text"
    />
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-[30%] h-4/5 bg-slate-400 mt-10 rounded-2xl relative ">
      <button
        className="hover:text-black hover:bg-white text-2xl w-10 rounded-xl 
               text-white bg-black hover:cursor-pointer absolute top-3 right-6 z-50"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? "\u2212" : "\u002B"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ onSelectMovie, movies }) {
  return (
    <ul className="list-none overflow-auto h-full relative ">
      {movies?.map((movie, i) => (
        <Movie movie={movie} key={i} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li
      onClick={() => onSelectMovie(movie.imdbID)}
      className="flex flex-row px-5 py-5 gap-4 hover:bg-rose-700 hover:cursor-pointer hover:text-white border-b-2 border-slate-500"
    >
      <img
        className="w-24 h-24"
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <div className="flex flex-col w-4/5 pt-2">
        <h3 className="text-dark  text-xl text-start">{movie.Title}</h3>
        <h4 className="italic text-xl text-start font-semibold">
          ({movie.Year})
        </h4>
      </div>
    </li>
  );
}

function Error({ message }) {
  return (
    <p className="text-center text-xl text-red-900 mt-20 font-bold">
      <span className="text-2xl mr-2">⛔️</span>
      {message}
    </p>
  );
}

function Loader() {
  return (
    <div className="flex justify-center items-center mt-40">
      <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-rose-700"></div>
    </div>
  );
}
function MovieDetails({
  selectedId,
  onCloseMovie,
  handleAddBookmarked,
  bookmarkedMovies,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const [recentBookmark, setRecentBookmark] = useState(false);

  const isWatched =
    Array.isArray(bookmarkedMovies) &&
    bookmarkedMovies.map((movie) => movie?.imdbID).includes(selectedId);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const watchedMovie = {
      imdbID: selectedId,
      title: title,
      year: year,
      poster: poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
    };
    handleAddBookmarked(watchedMovie);
    setRecentBookmark((value) => !value);
  }
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Space") {
          onCloseMovie();
        }
      }

      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();

      setMovie(data);

      setIsLoading(false);
    };

    fetchData();
  }, [selectedId]);

  useEffect(
    function () {
      if (!title) return;

      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Movify";
      };
    },
    [title]
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-rose-700 text-white h-full overflow-auto">
          <header className=" flex flex-row gap-4 bg-rose-900 relative">
            <button
              className="hover:text-black hover:bg-white text-2xl w-10 rounded-xl 
               text-white bg-rose-700 hover:cursor-pointer absolute top-3 left-4"
              onClick={onCloseMovie}
            >
              &larr;
            </button>
            <img
              className="w-40 h-full"
              src={poster}
              alt={`Poster of ${title} movie`}
            />
            <div className="flex flex-col py-4 gap-2">
              <h2 className="text-2xl text-start">{title}</h2>
              <p className="text-sm text-start pt-5">
                {released} &bull; {runtime}
              </p>
              <p className="text-sm text-start">{genre}</p>
              <p className="text-sm text-start">
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section className="flex flex-col gap-5 p-10 justify-start  ">
            <div className="bg-rose-900 h-content py-4 ">
              {!recentBookmark && isWatched && (
                <div className="flex flex-col gap-3 items-center">
                  <p>You already bookmarked this movie.</p>
                </div>
              )}
              {!recentBookmark && !isWatched && (
                <div className="flex flex-col gap-3 items-center">
                  <p>Want to watch this movie Later?</p>
                  <button
                    onClick={handleAdd}
                    className="hover:text-black hover:bg-white text-sm px-4 text-center rounded-xl 
               text-white bg-black hover:cursor-pointer py-1 w-52 border-orange-200 border-2"
                  >
                    Add to Bookmarks
                  </button>
                </div>
              )}
              {recentBookmark && (
                <div className="flex flex-col gap-3 items-center ">
                  <p className="text-golden-900">Successfully bookmarked!</p>
                </div>
              )}
            </div>
            <p className="text-sm text-start">
              <em>{plot}</em>
            </p>
            <p className="text-sm text-start ">Starring {actors}</p>
            <p className="text-start font-bold ">Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}

function BookMarkedMovieList({ bookmarkedMovies, handleRemoveBookmark }) {
  return (
    <div className="bg-rose-800 text-white h-full overflow-auto">
      <div className="bg-rose-600 text-start h-content pt-2 pb-4 rounded-2xl shadow-md  shadow-neutral-200 mb-3">
        <h3 className=" pt-2 pb-1 text-center text-xl ">
          Your Bookmarked Movies List!
        </h3>
        <h4 className="pl-24">
          #️⃣ {bookmarkedMovies ? bookmarkedMovies.length : "0"} movies
        </h4>
      </div>
      <ul className="list-none  h-content relative bg-rose-700 ">
        {bookmarkedMovies?.map((movie, i) => (
          <BookMarkedMovie
            movie={movie}
            key={movie.imdbID}
            handleRemoveBookmark={handleRemoveBookmark}
          />
        ))}
      </ul>
    </div>
  );

  function BookMarkedMovie({ movie }) {
    return (
      <li className="flex flex-row px-2 py-2 gap-4 bg-rose-800 :cursor-pointer text-white border-b-2 border-slate-500">
        <img
          className="w-20 h-20"
          src={movie.poster}
          alt={`${movie.title} poster`}
        />
        <div className="relative w-full">
          <h3 className="text-dark text-xl text-start ">{movie.title}</h3>
          <div className="flex flex-row py-3 gap-4 ">
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>&#x1F4C5;</span>
              <span>{movie.year}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
            </p>
          </div>
          <button
            className="hover:text-black hover:bg-white text-sm w-7  rounded-xl 
               text-white bg-gray-900 hover:cursor-pointer text-center absolute right-20 bottom-4"
            onClick={() => {
              handleRemoveBookmark(movie.imdbID);
            }}
          >
            {"\u2212"}
          </button>
        </div>
      </li>
    );
  }
}

export default App;
