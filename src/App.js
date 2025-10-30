import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  //  Autocomplete fetch
  useEffect(() => {
    if (query.length > 2) {
      fetch(`https://openlibrary.org/search.json?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          const titles = data.docs.slice(0, 5).map((b) => b.title);
          setSuggestions(titles);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  //  Search function
  const searchBooks = async () => {
    if (!query.trim()) {
      setMessage("Please enter a book title.");
      return;
    }

    setSuggestions([]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      if (data.docs.length === 0) {
        setMessage("No books found. Try a different title.");
        setBooks([]);
      } else {
        setBooks(data.docs.slice(0, 12));
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      setSuggestions([]);
    }
  };
  //hide list when user click outside also
  useEffect(() => {
    const handleClickOutside = () => setSuggestions([]);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);  

  //  Cover image fallback
  const getCover = (book) => {
    if (book.cover_i)
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    if (book.isbn && book.isbn.length > 0)
      return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
    return "https://via.placeholder.com/150x220?text=No+Cover";
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>📚 Book Finder</h1>

      <div className="top-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for a book..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSuggestions([]); // hide suggestions after pressing Enter
                searchBooks();
              }
            }}
          />
          <button onClick={searchBooks}>Search</button>
        </div>

        <button
          className="mode-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((title, i) => (
            <li
              key={i}
              onClick={() => {
                setQuery(title);
                setSuggestions([]);
                searchBooks();
              }}
            >
              {title}
            </li>
          ))}
        </ul>
      )}

      {/* Messages and Loader */}
      {message && <p className="info">{message}</p>}
      {loading && <div className="loader"></div>}

      {/* Results */}
      <div className="book-grid">
        {books.map((book, index) => (
          <div key={index} className="book-card">
            <img src={getCover(book)} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author_name ? book.author_name.join(", ") : "Unknown Author"}</p>
          </div>
        ))}
      </div>

      <footer>Candidate ID: Naukri1025</footer>
    </div>
  );
}

export default App;
