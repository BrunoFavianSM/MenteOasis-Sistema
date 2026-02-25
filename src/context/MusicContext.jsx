import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const MusicProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(() => {
        const saved = localStorage.getItem('musicMuted');
        return saved === 'true';
    });
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`${API_URL}/api/content/settings`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.music_url) {
                        const url = data.music_url.startsWith('http') ? data.music_url : `${API_URL}${data.music_url}`;

                        if (!audioRef.current) {
                            audioRef.current = new Audio(url);
                            audioRef.current.loop = true;
                            audioRef.current.volume = 0.3;
                        } else {
                            audioRef.current.src = url;
                        }

                        if (!isMuted) {
                            audioRef.current.play().then(() => {
                                setIsPlaying(true);
                            }).catch(error => {
                                console.log('Autoplay blocked, waiting for user interaction');
                            });
                        }
                    }
                }
            } catch (error) {
                console.log('Using fallback music');
                if (!audioRef.current) {
                    audioRef.current = new Audio('/bucle.m4a');
                    audioRef.current.loop = true;
                    audioRef.current.volume = 0.3;
                }
            }
        };

        fetchSettings();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        // Update audio mute state
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(error => {
                    console.log('Play failed:', error);
                });
            }
        }
        // Save preference to localStorage
        localStorage.setItem('musicMuted', isMuted);
    }, [isMuted]);

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    const value = {
        isMuted,
        isPlaying,
        toggleMute,
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
};
