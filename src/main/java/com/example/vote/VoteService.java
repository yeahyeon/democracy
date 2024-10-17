package com.example.vote;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Service
public class VoteService {
    private final VoteRepository voteRepository;

    public VoteService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    public Mono<Vote> createVote(Vote vote) {
        return voteRepository.save(vote);
    }

    public Mono<Vote> getVoteById(Long id) {
        return voteRepository.findById(id);
    }

    public Mono<Vote> voteAgree(Long id) {
        return voteRepository.findById(id)
                .flatMap(vote -> {
                    vote.setAgree(vote.getAgree() + 1);
                    return voteRepository.save(vote);
                });
    }

    public Mono<Vote> voteDisagree(Long id) {
        return voteRepository.findById(id)
                .flatMap(vote -> {
                    vote.setDisagree(vote.getDisagree() + 1);
                    return voteRepository.save(vote);
                });
    }

    public Flux<Vote> getAllVotes() {
        return voteRepository.findAll();
    }

    public Flux<Vote> streamVotes() {
        return Flux.interval(Duration.ofSeconds(1))
                .flatMap(tick -> voteRepository.findAll());
    }
}
