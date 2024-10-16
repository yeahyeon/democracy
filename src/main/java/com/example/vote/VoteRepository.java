package com.example.vote;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface VoteRepository extends ReactiveCrudRepository<Vote, Integer> {
}
