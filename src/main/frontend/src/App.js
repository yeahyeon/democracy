import React, { useState, useEffect } from 'react';
import VotingComponent from './components/VotingComponent';
import './App.css';

function App() {
    const [topic, setTopic] = useState("");
    const [isVoting, setIsVoting] = useState(false);
    const [voteId, setVoteId] = useState(null);
    const [recentVotes, setRecentVotes] = useState([]);

    useEffect(() => {
        const fetchRecentVotes = async () => {
            try {
                const response = await fetch('http://192.168.1.41:8080/votes/all');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRecentVotes(data.slice(-5)); // Get the last 5 votes
            } catch (error) {
                console.error('Error fetching recent votes:', error);
            }
        };
        fetchRecentVotes();
    }, []);

    useEffect(() => {
        const fetchCurrentVote = async () => {
            try {
                const response = await fetch('http://192.168.1.41:8080/votes/current');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.topic) {
                        setTopic(data.topic);
                        setVoteId(data.id);
                        setIsVoting(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching current vote:', error);
            }
        };
        fetchCurrentVote();
    }, []);

    const handleStart = async () => {
        if (topic.trim() !== "") {
            try {
                const response = await fetch('http://192.168.1.41:8080/votes/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ topic, agree: 0, disagree: 0 }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setVoteId(data.id);
                setIsVoting(true);
            } catch (error) {
                console.error('Error creating vote:', error);
            }
        }
    };

    return (
        <div className="App">
            {!isVoting ? (
                <div>
                    <h1>Enter Voting Topic</h1>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter the topic here"
                    />
                    <button onClick={handleStart}>Start Voting</button>
                    <h2>Recent Votes</h2>
                    <ul>
                        {recentVotes.map((vote) => (
                            <li key={vote.id}>
                                Topic: {vote.topic} | Agree: {vote.agree} | Disagree: {vote.disagree}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <VotingComponent topic={topic} voteId={voteId} setIsVoting={setIsVoting} />
            )}
        </div>
    );
}

export default App;