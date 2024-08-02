import React, { useState, useEffect } from 'react';
import './NewsApp.css';

const NewsArticle = ({ article }) => {
    return (
        <div className='news-article'>
            {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} className='news-image' />
            )}
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target='_blank' rel='noopener noreferrer'>Read more</a>
        </div>
    );
};

const NewsApp = () => {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(9); // 3 columns x 3 rows per page
    const [selectedCategory, setSelectedCategory] = useState('general');

    useEffect(() => {
        const fetchNews = async () => {
            const url = `https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&apiKey=594e7c65a0394c01b9b99a1399d9d896`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                setNews(data.articles || []);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, [selectedCategory]);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

    return (
        <div>
            <div className="dropdown">
                <button className="dropbtn">Category</button>
                <div className="dropdown-content">
                    <a href="#" onClick={() => setSelectedCategory('sports')}>Sports</a>
                    <a href="#" onClick={() => setSelectedCategory('technology')}>Tech</a>
                    <a href="#" onClick={() => setSelectedCategory('business')}>Business</a>
                    <a href="#" onClick={() => setSelectedCategory('market')}>Market</a>
                    <a href="#" onClick={() => setSelectedCategory('traffic')}>Traffic</a>
                    <a href="#" onClick={() => setSelectedCategory('government')}>Government</a>
                </div>
            </div>
            <div className='news-container'>
                {news.slice(indexOfFirstArticle, indexOfLastArticle).map((article, index) => (
                    <NewsArticle key={index} article={article} />
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default NewsApp;
