import React, { useState, useEffect } from 'react';
import './VotingComponent.css';

function VotingComponent() {
    const [votes, setVotes] = useState({ agree: 0, disagree: 0 });

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8080/votes/stream/voteId');

        eventSource.onmessage = function(event) {
            const voteData = JSON.parse(event.data);
            setVotes(voteData);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const voteAgree = async () => {
        await fetch('http://localhost:8080/votes/agree/voteId', { method: 'POST' });
    };

    const voteDisagree = async () => {
        await fetch('http://localhost:8080/votes/disagree/voteId', { method: 'POST' });
    };

    // 전체 투표 수 계산
    const totalVotes = votes.agree + votes.disagree;

    // 투표 비율 계산 (최소값을 1로 설정하여 기본 크기 보장)
    const agreeFlex = totalVotes ? votes.agree / totalVotes : 0.5;
    const disagreeFlex = totalVotes ? votes.disagree / totalVotes : 0.5;

    return (
        <div className="voting-container">
            <div
                className="agree-area"
                onClick={voteAgree}
                style={{ flexGrow: agreeFlex }}
            >
                <div className="label-agree">Agree</div>
                <div className="vote-count">{votes.agree}</div>
            </div>
            <div
                className="disagree-area"
                onClick={voteDisagree}
                style={{ flexGrow: disagreeFlex }}
            >
                <div className="label-disagree">Disagree</div>
                <div className="vote-count">{votes.disagree}</div>
            </div>
        </div>
    );
}

export default VotingComponent;
