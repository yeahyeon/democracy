package com.example.vote;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("vote")
public class Vote {
    @Id
    private Long id;
    private String topic;
    private int agree;
    private int disagree;

    public Vote(String topic, int agree, int disagree) {
        this.topic = topic;
        this.agree = agree;
        this.disagree = disagree;
    }
}