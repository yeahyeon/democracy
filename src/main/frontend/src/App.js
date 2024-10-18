import React, { useState, useEffect } from 'react';
import VotingComponent from './components/VotingComponent';
import './App.css';

function App() {
    const [topic, setTopic] = useState("");
    const [isVoting, setIsVoting] = useState(false);
    const [voteId, setVoteId] = useState(null);
    const [recentVotes, setRecentVotes] = useState([]);

    useEffect(() => {
        // 모든 투표 상태 가져오기
        const fetchRecentVotes = async () => {
            try {
                const response = await fetch('http://192.168.1.41:8080/votes/all');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRecentVotes(data.slice(-5)); // 최근 5개의 투표만 표시
            } catch (error) {
                console.error('Error fetching recent votes:', error);
            }
        };
        fetchRecentVotes();
    }, []);

    useEffect(() => {
        // SSE로 실시간으로 투표 생성 및 업데이트 알림을 수신
        const eventSource = new EventSource('http://192.168.1.41:8080/votes/stream');
        eventSource.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            setTopic(data.topic); // 새로 생성된 투표 주제를 설정
            setVoteId(data.id); // 새로 생성된 투표 ID를 설정
            setIsVoting(true); // 투표 화면으로 전환
        });

        // 컴포넌트가 언마운트될 때 SSE 연결 닫기
        return () => {
            eventSource.close();
        };
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












