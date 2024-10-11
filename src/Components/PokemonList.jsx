import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PokemonList.css"; // Import the CSS file
import { FaRegArrowAltCircleUp } from "react-icons/fa";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null); // State to hold the error message

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=300"
        );
        const results = response.data.results;

        // Fetch additional details for each Pokemon
        const detailedPokemonList = await Promise.all(
          results.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return details.data;
          })
        );
        setPokemonList(detailedPokemonList);
        setError(null); // Reset error state when data is successfully fetched
      } catch (error) {
        // Check for rate limit error
        if (error.response && error.response.status === 429) {
          setError("Rate limit exceeded. Please try again later.");
        } else {
          setError("Failed to fetch Pokémon data. Please try again later.");
        }
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchPokemon();
  }, []);

  // Search filtering with input sanitization
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Basic sanitization: remove any non-alphanumeric characters
    const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
    setSearchTerm(sanitizedValue);
  };

  const filteredPokemon = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to scroll to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const button = document.querySelector(".back-to-top");
      if (window.scrollY > 300) {
        button.style.display = "block";
      } else {
        button.style.display = "none";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="pokemon-container">
          {filteredPokemon.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="pokemon-image"
              />
              <h3>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h3>
            </div>
          ))}
        </div>
      )}

      {/* Back to Top Button */}
      <button onClick={scrollToTop} className="back-to-top">
        <FaRegArrowAltCircleUp />
      </button>
    </div>
  );
};

export default PokemonList;
