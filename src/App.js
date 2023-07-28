function App() {
  return (
    <div className="bg-green-800 text-center h-screen w-screen">
      <Navbar />
    </div>
  );
}

function Navbar() {
  return (
    <div className="h-20 w-full flex flex-row bg-green-600 items-center">
      <Logo>Movify</Logo>
    </div>
  );
}

function Logo({ children }) {
  return (
    <div className="items-center items-end logo-container flex flex-row ml-24">
      <span className="justify-self-end text-5xl mb-5"> &#x1F4F7;</span>
      <span className="text-4xl text-white font-semibold italic">
        {children}
      </span>
    </div>
  );
}

export default App;
