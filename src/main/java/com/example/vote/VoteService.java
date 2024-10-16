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

    public Mono<Vote> getVotes(String id) {
        return voteRepository.findById(Integer.valueOf(id));
    }

    public Mono<Vote> voteAgree(String id) {
        return voteRepository.findById(Integer.valueOf(id))
                .flatMap(vote -> {
                    vote.setAgree(vote.getAgree() + 1);
                    return voteRepository.save(vote);
                });
    }

    public Mono<Vote> voteDisagree(String id) {
        return voteRepository.findById(Integer.valueOf(id))
                .flatMap(vote -> {
                    vote.setDisagree(vote.getDisagree() + 1);
                    return voteRepository.save(vote);
                });
    }

    public Flux<Vote> streamVotes(String id) {
        return Flux.interval(Duration.ofSeconds(1))
                .flatMap(tick -> voteRepository.findById(Integer.valueOf(id)).flux());
    }
}