package com.example.vote;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

import java.time.LocalDateTime;

@Service
public class VoteService {
    private final VoteRepository voteRepository;
    private final Sinks.Many<Vote> voteSink; // SSE를 위한 sink

    public VoteService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
        this.voteSink = Sinks.many().multicast().onBackpressureBuffer(); // 실시간 스트림 설정
    }

    public Mono<Vote> getVoteById(Long id) {
        return voteRepository.findById(id);
    }

    public Mono<Vote> voteAgree(Long id) {
        return voteRepository.findById(id)
                .flatMap(vote -> {
                    vote.setAgree(vote.getAgree() + 1);
                    return voteRepository.save(vote)
                            .doOnNext(updatedVote -> voteSink.tryEmitNext(updatedVote)); // 투표 업데이트 시 실시간 반영
                });
    }

    public Mono<Vote> voteDisagree(Long id) {
        return voteRepository.findById(id)
                .flatMap(vote -> {
                    vote.setDisagree(vote.getDisagree() + 1);
                    return voteRepository.save(vote)
                            .doOnNext(updatedVote -> voteSink.tryEmitNext(updatedVote)); // 투표 업데이트 시 실시간 반영
                });
    }

    public Flux<Vote> getAllVotes() {
        return voteRepository.findAll();
    }

    // 실시간 스트림을 위한 메서드
    public Flux<Vote> streamVotes() {
        return voteSink.asFlux(); // 실시간 스트림으로 연결된 클라이언트들에게 전송
    }

    public Mono<Vote> createVote(Vote vote) {
        vote.setStartTime(LocalDateTime.now()); // 투표 시작 시간 설정
        return voteRepository.save(vote)
                .doOnNext(savedVote -> voteSink.tryEmitNext(savedVote)); // 새 투표 생성 시 실시간 전송
    }
}