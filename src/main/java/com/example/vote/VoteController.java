package com.example.vote;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
// @NoArgsConstructor
//@AllArgsConstructor
@RequestMapping("/votes")
public class Controller {
    @Autowired
    private VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @GetMapping("/stream/{id}")
    public Flux<ServerSentEvent<Vote>> streamVotes(@PathVariable String id) {
        return voteService.streamVotes(id)
                .map(vote -> ServerSentEvent.builder(vote).build());
    }

    @PostMapping("/agree/{id}")
    public Mono<ResponseEntity<Vote>> voteAgree(@PathVariable String id) {
        return voteService.voteAgree(id)
                .map(ResponseEntity::ok);
    }

    @PostMapping("/disagree/{id}")
    public Mono<ResponseEntity<Vote>> voteDisagree(@PathVariable String id) {
        return voteService.voteDisagree(id)
                .map(ResponseEntity::ok);
    }
}
