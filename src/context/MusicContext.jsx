import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};

export const MusicProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [isMuted, setIsMuted] = useState(() => {
        // Get mute preference from localStorage
        const saved = localStorage.getItem('musicMuted');
        return saved === 'true';
    });
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Create audio element
        audioRef.current = new Audio('/bucle.m4a');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3; // Set volume to 30% for ambient music

        // Try to play music automatically
        const playMusic = async () => {
            try {
                if (!isMuted) {
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } catch (error) {
                // Autoplay might be blocked by browser, user will need to interact first
                console.log('Autoplay blocked, waiting for user interaction');
            }
        };

        playMusic();

        // Cleanup
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
