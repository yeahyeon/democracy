package com.example.vote;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

@Data
@Table("vote")
public class Vote {
    @Id
    private Long id;
    private String topic;
    private int agree;
    private int disagree;

    // 투표 시작 시간을 저장할 필드 추가
    private LocalDateTime startTime;

    public Vote(String topic, int agree, int disagree) {
        this.topic = topic;
        this.agree = agree;
        this.disagree = disagree;
        this.startTime = LocalDateTime.now(); // 투표 생성 시 현재 시간을 설정
    }
}