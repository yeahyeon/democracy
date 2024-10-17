package com.example.vote;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/votes")
public class VoteController {

    @Autowired
    private VoteService voteService;

    // Constructor
    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    // Create a new vote topic
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create")
    public Mono<ResponseEntity<Vote>> createVote(@RequestBody Vote newVote) {
        return voteService.createVote(newVote).map(ResponseEntity::ok);
    }

    // Stream votes to all clients (Server-Sent Events)
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Vote>> streamVotes() {
        return voteService.streamVotes()
                .map(vote -> ServerSentEvent.builder(vote).build());
    }

    // Vote agree
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/agree/{id}")
    public Mono<ResponseEntity<Vote>> voteAgree(@PathVariable Long id) {
        return voteService.voteAgree(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    // Vote disagree
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/disagree/{id}")
    public Mono<ResponseEntity<Vote>> voteDisagree(@PathVariable Long id) {
        return voteService.voteDisagree(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    // Get vote results by id
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public Mono<ResponseEntity<Vote>> getVoteById(@PathVariable Long id) {
        return voteService.getVoteById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    // Get all vote topics and their results
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/all")
    public Flux<Vote> getAllVotes() {
        return voteService.getAllVotes();
    }
}