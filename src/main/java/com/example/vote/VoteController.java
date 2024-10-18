package com.example.vote;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    // 새로운 투표 생성 시 모든 클라이언트에게 알림
    @CrossOrigin(origins = "*")
    @PostMapping("/create")
    public Mono<ResponseEntity<Vote>> createVote(@RequestBody Vote newVote) {
        return voteService.createVote(newVote)
                .map(savedVote -> ResponseEntity.ok(savedVote));
    }

    // 실시간 스트림을 클라이언트로 전송
    @CrossOrigin(origins = "*")
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Vote>> streamVotes() {
        return voteService.streamVotes()
                .map(vote -> ServerSentEvent.builder(vote).build());
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/agree/{id}")
    public Mono<ResponseEntity<Vote>> voteAgree(@PathVariable Long id) {
        return voteService.voteAgree(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/disagree/{id}")
    public Mono<ResponseEntity<Vote>> voteDisagree(@PathVariable Long id) {
        return voteService.voteDisagree(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{id}")
    public Mono<ResponseEntity<Vote>> getVoteById(@PathVariable Long id) {
        return voteService.getVoteById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/all")
    public Flux<Vote> getAllVotes() {
        return voteService.getAllVotes();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{id}/remainingTime")
    public Mono<ResponseEntity<Map<String, Long>>> getRemainingTime(@PathVariable Long id) {
        return voteService.getVoteById(id)
                .map(vote -> {
                    Map<String, Long> response = new HashMap<>();

                    // 남은 시간 계산 (30초 제한으로 가정)
                    LocalDateTime now = LocalDateTime.now();
                    long remainingTime = 30 - java.time.Duration.between(vote.getStartTime(), now).getSeconds();

                    response.put("remainingTime", Math.max(remainingTime, 0)); // 남은 시간 반환, 음수 방지
                    return ResponseEntity.ok(response);
                })
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{id}/isEnded")
    public Mono<ResponseEntity<Map<String, Boolean>>> isVoteEnded(@PathVariable Long id) {
        return voteService.getVoteById(id)
                .map(vote -> {
                    Map<String, Boolean> response = new HashMap<>();

                    // 현재 시간과 투표 시작 시간 비교 (30초 후 투표 종료)
                    LocalDateTime now = LocalDateTime.now();
                    boolean isEnded = vote.getStartTime().plusSeconds(30).isBefore(now);

                    response.put("isEnded", isEnded);
                    return ResponseEntity.ok(response);
                })
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}