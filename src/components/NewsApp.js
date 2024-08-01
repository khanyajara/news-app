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

function NewsApp() {
    const [teslaNews, setTeslaNews] = useState([]);
    const [appleNews, setAppleNews] = useState([]);
    const [techCrunchNews, setTechCrunchNews] = useState([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        const urls = [`https://newsapi.org/v2/everything?q=tesla&from=2024-07-01&sortBy=publishedAt&apiKey=594e7c65a0394c01b9b99a1399d9d896 `,
                      `https://newsapi.org/v2/everything?q=apple&from=2024-07-31&to=2024-07-31&sortBy=popularity&apiKey=594e7c65a0394c01b9b99a1399d9d896`,
                      `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=594e7c65a0394c01b9b99a1399d9d896`
                      ] 
        try {
            const response = await fetch(urls);
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
        <div className='row'>
            <div className='column'>
                <h2>Tesla News</h2>
                {teslaNews.map((article, index) => (
                    <NewsArticle key={index} article={article} />
                ))}
            </div>
            <div className='column'>
                <h2>Apple News</h2>
                {appleNews.map((article, index) => (
                    <NewsArticle key={index} article={article} />
                ))}
            </div>
            <div className='column'>
                <h2>Tech Crunch News</h2>
                {techCrunchNews.map((article, index) => (
                    <NewsArticle key={index} article={article} />
                ))}
            </div>
        </div>
    );
}

export default NewsApp;
