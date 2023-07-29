function App() {
  return (
    <>
      <Navbar />
      <Main>
        <Box />
        <Box />
      </Main>
    </>
  );
}

function Main({ children }) {
  return (
    <div className="bg-slate-600 text-center h-screen w-screen flex flex-row gap-14 justify-center">
      {children}
    </div>
  );
}

function Navbar() {
  return (
    <div className="h-20 w-full grid grid-cols-3 bg-slate-700 items-center shadow-4xl px-36">
      <Logo>Movify</Logo>
      <Search />
      <Results />
    </div>
  );
}

function Logo({ children }) {
  return (
    <div className="items-center logo-container flex flex-row ">
      <span className="justify-self-end text-5xl mb-5"> &#x1F4F7;</span>
      <span className="text-4xl text-white font-semibold italic">
        {children}
      </span>
    </div>
  );
}
function Results() {
  return (
    <p className="text-xl text-white justify-self-end font-bold">
      3 Results Found
    </p>
  );
}
function Search() {
  return (
    <input
      className="w-80 text-xl text-white p-3 shadow-2xl bg-slate-500 focus:outline-none focus:border-2 focus:bg-slate-300 focus:text-black focus:ring rounded-2xl justify-self-center border-black border-1"
      placeholder="Search Movies...."
      type="text"
    />
  );
}

function Box() {
  return <div className="w-1/3 h-4/5 bg-slate-400 mt-10 rounded-2xl"></div>;
}
export default App;
