import React, { useState, useEffect } from 'react';
import './VotingComponent.css';

function VotingComponent({ topic, voteId, setIsVoting }) {
    const [agree, setAgree] = useState(0);
    const [disagree, setDisagree] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30); // 기본값을 30초로 설정
    const [isEnded, setIsEnded] = useState(false); // 투표 종료 상태

    // 서버에서 남은 시간을 받아오는 함수
    const fetchRemainingTime = async () => {
        try {
            const response = await fetch(`http://192.168.1.41:8080/votes/${voteId}/remainingTime`);
            if (response.ok) {
                const data = await response.json();
                setTimeLeft(data.remainingTime); // 서버에서 받은 남은 시간 설정
            } else {
                console.error('Failed to fetch remaining time.');
            }
        } catch (error) {
            console.error('Error fetching remaining time:', error);
            setTimeLeft(30); // 서버로부터 값을 받지 못할 경우 기본값을 설정
        }
    };

    // 투표 상태와 남은 시간을 초기화
    useEffect(() => {
        const fetchInitialVote = async () => {
            try {
                const response = await fetch(`http://192.168.1.41:8080/votes/${voteId}`);
                if (response.ok) {
                    const data = await response.json();
                    setAgree(data.agree);
                    setDisagree(data.disagree);
                }
            } catch (error) {
                console.error("Error fetching initial vote data:", error);
            }
        };

        fetchInitialVote();
        fetchRemainingTime(); // 투표 화면 진입 시 남은 시간 가져오기

        // 실시간 투표 상태 업데이트
        const eventSource = new EventSource("http://192.168.1.41:8080/votes/stream");
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.id === voteId) {
                setAgree(data.agree);
                setDisagree(data.disagree);
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [voteId]);

    // 투표 종료 여부를 서버에서 확인
    const checkIfVoteEnded = async () => {
        try {
            const response = await fetch(`http://192.168.1.41:8080/votes/${voteId}/isEnded`);
            if (response.ok) {
                const data = await response.json();
                if (data.isEnded) {
                    setIsEnded(true); // 투표가 종료된 상태 설정
                    setIsVoting(false); // 투표 주제 입력 화면으로 돌아가기
                }
            }
        } catch (error) {
            console.error('Error checking if vote ended:', error);
        }
    };

    // 타이머 설정 및 남은 시간 업데이트
    useEffect(() => {
        if (timeLeft > 0 && !isEnded) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 || isEnded) {
            checkIfVoteEnded(); // 투표 종료 여부 확인
        }
    }, [timeLeft, isEnded, setIsVoting, voteId]);

    // 투표 기능 - 버튼 클릭 후 즉시 상태 업데이트
    const vote = async (type) => {
        if (type === "agree") {
            setAgree((prev) => prev + 1); // UI 즉시 반영
        } else if (type === "disagree") {
            setDisagree((prev) => prev + 1); // UI 즉시 반영
        }

        try {
            await fetch(`http://192.168.1.41:8080/votes/${type}/${voteId}`, {
                method: "POST",
            });
        } catch (error) {
            console.error(`Error voting ${type}:`, error);
        }
    };

    // 남은 시간을 포맷팅하는 함수
    const formatTime = (seconds) => {
        if (seconds === null) return 'Loading...'; // 남은 시간을 받아오는 중일 때 표시
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














