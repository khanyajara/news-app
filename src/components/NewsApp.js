import React, { useState, useEffect } from 'react';
import './NewsApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

const NewsArticle = ({ article, onBookmark, onSaveOffline }) => {
    const { title, url, urlToImage, description } = article;

    const emailLink = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
    const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const instagramLink = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;

    return (
        <div className='news-article'>
            <img src={urlToImage} alt={title} className='news-image' />
            <h3>{title}</h3>
            <p>{description}...</p>
            <a href={url} target='_blank' rel='noopener noreferrer'>Read more</a>
            <div>
                <a href={emailLink} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon icon={faEnvelope} />
                </a>
                <a href={whatsappLink} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon icon={faWhatsapp} />
                </a>
                <a href={facebookLink} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href={instagramLink} target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon icon={faInstagram} />
                </a>
                <button className="bookmark-button" onClick={() => onBookmark(article)}>
    <FontAwesomeIcon icon={faBookmark} /> Bookmark
</button>
<button className="save-offline-button" onClick={() => onSaveOffline(article)}>
    <FontAwesomeIcon icon={faBookmark} /> Save Offline
</button>

            </div>
        </div>
    );
};

const NewsApp = () => {
    const [news, setNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(9);
    const [selectedCategory, setSelectedCategory] = useState('general');
    const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
    const [offlineArticles, setOfflineArticles] = useState([]);
    const [showBookmarks, setShowBookmarks] = useState(false);
    const [showOfflineArticles, setShowOfflineArticles] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const categories = ['general', 'sports', 'technology', 'business', 'politics', 'entertainment', 'health', 'science'];

    useEffect(() => {
        const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles')) || [];
        const savedOfflineArticles = JSON.parse(localStorage.getItem('offlineArticles')) || [];
        setBookmarkedArticles(savedBookmarks);
        setOfflineArticles(savedOfflineArticles);

        // Fetch news if online or if the category is changed
        if (isOnline) {
            fetchNews();
        } else {
            const savedNews = JSON.parse(localStorage.getItem('news')) || {};
            if (savedNews[selectedCategory]) {
                setNews(savedNews[selectedCategory]);
            } else {
                setNews([]);
            }
        }

        // Set online/offline event listeners
        const handleOnline = () => {
            setIsOnline(true);
            fetchNews(); // Fetch news again when coming online
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [selectedCategory, isOnline]);

    const fetchNews = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&apiKey=594e7c65a0394c01b9b99a1399d9d896`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setNews(data.articles || []);
            // Save fetched news to local storage
            const savedNews = JSON.parse(localStorage.getItem('news')) || {};
            savedNews[selectedCategory] = data.articles || [];
            localStorage.setItem('news', JSON.stringify(savedNews));
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const handleBookmark = (article) => {
        const updatedBookmarks = bookmarkedArticles.some(item => item.url === article.url)
            ? bookmarkedArticles.filter(item => item.url !== article.url)
            : [...bookmarkedArticles, article];

        setBookmarkedArticles(updatedBookmarks);
        localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedBookmarks));
    };

    const saveOfflineArticle = (article) => {
        const updatedOfflineArticles = offlineArticles.some(item => item.url === article.url)
            ? offlineArticles.filter(item => item.url !== article.url)
            : [...offlineArticles, article];

        setOfflineArticles(updatedOfflineArticles);
        localStorage.setItem('offlineArticles', JSON.stringify(updatedOfflineArticles));
    };

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
    };

    const renderArticles = (articles) => (
        articles.slice(indexOfFirstArticle, indexOfLastArticle).map((article, index) => (
            <NewsArticle key={index} article={article} onBookmark={handleBookmark} onSaveOffline={saveOfflineArticle} />
        ))
    );

    return (
        <div>
            <div className="status-indicator">
                {isOnline ? "You are Online" : "You are Offline"}
            </div>
            <div className="category-tabs">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`tab ${selectedCategory === category && !showBookmarks && !showOfflineArticles ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedCategory(category);
                            setShowBookmarks(false);
                            setShowOfflineArticles(false);
                            setCurrentPage(1);
                        }}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
                <button
                    className={`tab ${showBookmarks ? 'active' : ''}`}
                    onClick={() => {
                        setShowBookmarks(true);
                        setShowOfflineArticles(false);
                        setCurrentPage(1);
                    }}
                >
                    Bookmarks
                </button>
                <button
                    className={`tab ${showOfflineArticles ? 'active' : ''}`}
                    onClick={() => {
                        setShowOfflineArticles(true);
                        setShowBookmarks(false);
                        setCurrentPage(1);
                    }}
                >
                    Offline Articles
                </button>
            </div>
            <h2>{showBookmarks ? 'Bookmarked Articles' : showOfflineArticles ? 'Offline Articles' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
            <div className='news-container'>
                {showBookmarks ? renderArticles(bookmarkedArticles) : showOfflineArticles ? renderArticles(offlineArticles) : renderArticles(news)}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default NewsApp;
