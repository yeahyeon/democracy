import React, { useState, useEffect } from 'react';
import './VotingComponent.css';

function VotingComponent({ topic, voteId, setIsVoting }) {
    const [agree, setAgree] = useState(0);
    const [disagree, setDisagree] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8080/votes/stream");
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setAgree(data.agree);
            setDisagree(data.disagree);
        };
        return () => {
            eventSource.close();
        };
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setIsVoting(false); // Return to topic input screen when time runs out
        }
    }, [timeLeft, setIsVoting]);

    const vote = (type) => {
        fetch(`http://localhost:8080/votes/${type}/${voteId}`, {
            method: "POST",
        });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="voting-component">
            <h2>Topic: {topic}</h2>
            <div>
                <button onClick={() => vote("agree")}>Agree</button>
                <button onClick={() => vote("disagree")}>Disagree</button>
            </div>
            <div className="results">
                <p>Agree: {agree}</p>
                <p>Disagree: {disagree}</p>
            </div>
            <div className="timer">
                <p>Time Left: {formatTime(timeLeft)}</p>
            </div>
        </div>
    );
}

export default VotingComponent;