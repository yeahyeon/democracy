package com.example.vote;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends ReactiveCrudRepository<Vote, Long> {
}