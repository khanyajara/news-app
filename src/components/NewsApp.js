import React, { useState, useEffect } from 'react';
import './styles.css';

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
    const [teslaNews, setTeslaNews] = useState([]);
    const [appleNews, setAppleNews] = useState([]);
    const [techCrunchNews, setTechCrunchNews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('general'); // Default to general

    useEffect(() => {
        const fetchNews = async () => {
            const urls = [
                `https://newsapi.org/v2/everything?q=tesla&from=2024-07-01&sortBy=publishedAt&apiKey=594e7c65a0394c01b9b99a1399d9d896`,
                `https://newsapi.org/v2/everything?q=apple&from=2024-07-31&to=2024-07-31&sortBy=popularity&apiKey=594e7c65a0394c01b9b99a1399d9d896`,
                `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=594e7c65a0394c01b9b99a1399d9d896`
            ];

            try {
                const [teslaResponse, appleResponse, techCrunchResponse] = await Promise.all(urls.map(url => fetch(url).then(res => res.json())));
                setTeslaNews(teslaResponse.articles);
                setAppleNews(appleResponse.articles);
                setTechCrunchNews(techCrunchResponse.articles);
            } catch (error) {
                console.error('Error fetching news:', error);
            }
        };

        fetchNews();
    }, []);

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
                <h2>TechCrunch News</h2>
                {techCrunchNews.map((article, index) => (
                    <NewsArticle key={index} article={article} />
                ))}
            </div>
        </div>
    );
};

export default NewsApp;
