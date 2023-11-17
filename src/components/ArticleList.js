import React, { useEffect, useState } from 'react';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Fetch articles from the API
    fetch('/articles')
      .then(response => response.json())
      .then(data => setArticles(data))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>
          <img src={article.imageUrl} alt={article.title} />
          <h3>{article.title}</h3>
          <a href={article.url} target="_blank" rel="noopener noreferrer">Read More</a>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
