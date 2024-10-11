import "./App.css";
import PokemonList from "./Components/PokemonList";

function App() {
  return (
    <>
      <div className="App">
        <h1>Pokémon List</h1>
        <div className="appcont">
          <PokemonList />
        </div>
      </div>
    </>
  );
}

export default App;
