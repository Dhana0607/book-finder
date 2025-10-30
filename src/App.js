import React, { useState } from "react";
import './App.css';

function App() {

  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()){
      alert("Please enter a book title!");
      return;
    }
    try{
      setLoading(true);
      const response = await fetch(`https://openlibrary.org/search.json?title=${query}`);
      if(!response.ok){
        throw new Error("Network Response is not good");
      }

      const data = await response.json();
      if(!data.docs || data.docs.length === 0){
        alert("No Books Found!");
        setBooks([]);
      } else{
        setBooks(data.docs.slice(0,12));
      }
    }
    catch (error){
      console.error("Error Fetching books:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="App">
      <h1>📚 Book Finder</h1>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for a Book.."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          />
          <button onClick={searchBooks}>Search</button> 
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="book-grid">
          {books.map((book, index) => {
            const cover =
            book.cover_i && book.cover_i !== undefined
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : book.isbn && book.isbn.length > 0
              ? `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`
              : "https://via.placeholder.com/150x220?text=No+Cover";

            const author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
            return (
              <div key = {index} className="book-card">
                <img src = {cover} alt={book.title}/>
                <h3>{book.title}</h3>
                <p>{author}</p>
              </div>
            );
          })}
    </div>
    )}
    <footer>Candidate ID: Naukri1025</footer>
    </div>
  );
}

export default App;
