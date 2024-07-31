import React from 'react';
import { useState, useEffect } from 'react';
import Css from './NewsApp.css'; 

function NewsArticle({ article }) {
    return (
        <div className="news-article">
            <h3>{article.title}</h3>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
        </div>
    );
}

function TeslaNewsApp() {
    const [teslaNews, setTeslaNews] = useState([]);

    useEffect(() => {
        fetchTeslaNews();
    }, []);

    const fetchTeslaNews = async () => {
        const url = `https://newsapi.org/v2/everything?q=tesla&from=2024-06-30&sortBy=publishedAt&apiKey=594e7c65a0394c01b9b99a1399d9d896`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTeslaNews(data.articles);
        } catch (error) {
            console.error('Error fetching Tesla news:', error);
        }
    };

    return (
        <div>
            <h2>Tesla News</h2>
            {teslaNews.map((article, index) => (
                <NewsArticle key={index} article={article} />
            ))}
        </div>
    );
}

export default TeslaNewsApp;
