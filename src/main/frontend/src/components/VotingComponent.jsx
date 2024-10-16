import React, { useState, useEffect } from 'react';

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

    return (
        <div>
            <h2>Agree: {votes.agree}</h2>
            <h2>Disagree: {votes.disagree}</h2>
            <button onClick={voteAgree}>Agree</button>
            <button onClick={voteDisagree}>Disagree</button>
        </div>
    );
}

export default VotingComponent