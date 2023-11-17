import React, { useEffect, useState } from 'react';

const ArticleDetails = ({ match }) => {
  const [article, setArticle] = useState(null);
  const articleId = match.params.id; // Assuming you're using React Router

  useEffect(() => {
    fetch(`/articles/${articleId}`)
      .then(response => response.json())
      .then(data => setArticle(data))
      .catch(error => console.error('Error:', error));
  }, [articleId]);

  return (
    <div>
      {article && (
        <>
          <img src={article.imageUrl} alt={article.title} />
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
          {/* Other details like source, date */}
          <a href={article.url} target="_blank" rel="noopener noreferrer">Read Full Article</a>
        </>
      )}
    </div>
  );
};

export default ArticleDetails;
