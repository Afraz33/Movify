import { useEffect, useState } from "react";

const KEY = "ad1a8d6";
function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState();
  const [error, setError] = useState("");
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

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
            console.log(err.message);
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
        <Box
          isOpen={isOpen1}
          Button={
            <Button setIsOpen={setIsOpen1}>
              {isOpen1 ? "\u2212" : "\u002B"}
            </Button>
          }
        >
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {!isLoading && error && <Error message={error} />}
        </Box>
        <Box
          isOpen={isOpen2}
          Button={
            <Button setIsOpen={setIsOpen2}>
              {isOpen2 ? "\u2212" : "\u002B"}
            </Button>
          }
        >
          {selectedId && (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
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

function Box({ children, Button, isOpen }) {
  return (
    <div className="w-[30%] h-4/5 bg-slate-400 mt-10 rounded-2xl relative">
      {Button}
      {isOpen && children}
    </div>
  );
}

function Button({ children, setIsOpen }) {
  return (
    <>
      <button
        className="hover:text-black hover:bg-white text-2xl w-8 rounded-xl 
               text-white bg-black hover:cursor-pointer absolute top-3 right-4 z-50"
        onClick={() => setIsOpen((x) => !x)}
      >
        {children}
      </button>
    </>
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
function MovieDetails({ selectedId, onCloseMovie }) {
  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState({});
  const {
    Title: title,
    // Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Space" || e.code === "ControlLeft") {
          onCloseMovie();
          console.log("Afraz");
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
      console.log(data);
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
        // console.log(`Clean up effect for movie ${title}`);
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
              className="text-black bg-white text-2xl w-10 rounded-xl 
               hover:text-white hover:bg-rose-900 hover:cursor-pointer absolute top-3 left-4"
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
export default App;
