---
name: youtube-researcher
description: Use this skill whenever the user wants to research YouTube for a content topic. Triggers on phrases like "리서치해줘", "유튜브 분석해줘", "경쟁 영상 찾아줘", "상위 영상 댓글 분석", or any request that involves finding YouTube videos and their audience feedback for a given keyword or product. Runs the search → comments pipeline and produces a structured research summary.
---

# YouTube Researcher Skill

## Purpose
특정 키워드(보통 육아용품 카테고리)에 대해 (1) 상위 유튜브 영상 메타를 수집하고, (2) 고성과 영상의 댓글을 분석해, (3) 콘텐츠 기회를 구조화된 마크다운으로 요약한다.

## When to Invoke
- "원목침대 리서치해줘"
- "휴대용 유모차 경쟁 영상 분석"
- "브레짜 댓글에서 사람들이 뭘 원하는지 보자"
- 사용자가 새 콘텐츠 주제를 꺼냈는데 기존 research 결과가 없을 때

## Mandatory Pre-Read
- `context/brand.md` — 어떤 관점으로 인사이트를 뽑아야 하는지
- `context/icp.md` — 어떤 페인이 우리 ICP에 맞는지 판단 기준

## Inputs
- **query** (필수): 검색 키워드 (한국어)
- **max_videos** (선택, 기본 20): `yt_search.py`로 수집할 영상 수
- **top_n** (선택, 기본 5): 댓글 분석 대상 상위 영상 수
- **comments_per_video** (선택, 기본 100): 영상당 수집할 댓글 수

## Workflow

### Step 1: Plan 출력 및 승인 대기
사용자에게 다음 형식으로 계획을 보여주고 승인을 받는다:

### Step 2: 영상 검색
```bash
python scripts/yt_search.py "[query]" --max [max_videos]
```
실행 결과의 저장 경로를 기억한다.

### Step 3: 메타 분석 (코드 없이, 파일만 읽고)
저장된 videos JSON을 읽어 다음을 파악:
- 쇼츠(duration < 60s) vs 롱폼 비율
- 조회수 중앙값과 상위 1% 갭
- 상위 채널 3곳
- 공통 태그 / 제목 패턴

이 단계는 반드시 수행. 댓글 수집 전에 "어떤 영상이 진짜 분석할 가치가 있는가"를 판단해야 하기 때문.

### Step 4: 댓글 수집
```bash
python scripts/yt_comments.py --from [videos_json_path] --max [comments_per_video] --top [top_n]
```

### Step 5: 댓글 클러스터링
저장된 comments JSON을 읽어 다음 카테고리로 분류:
- ❓ **Questions** — 사용자가 직접 던진 질문
- 😤 **Pain points** — 불만 / 혼란 / 실패 경험
- 🔥 **Validation** — 만족 / 추천 사유
- 💡 **Requests** — "이런 콘텐츠 보고 싶다" 요청
- 🔄 **Switching stories** — A에서 B로 갈아탄 경험담 (매우 중요)

각 카테고리에서 좋아요 순으로 상위 3개씩 원문 인용.

### Step 6: Opportunity 변환
클러스터링 결과를 context/brand.md와 context/icp.md에 비추어 다음 형식의 **콘텐츠 기회**로 변환:

```markdown
### Opportunity N: [한 문장 훅]
- **근거**: [comment_id 또는 발췌] (좋아요 N, 영상 [title])
- **ICP 매칭**: [어떤 pain에 대응하는지]
- **추천 포맷**: Short / Long / Both
- **차별화 포인트**: 도요님이 어떤 각도로 다르게 다룰 수 있는가
- **검색 의도**: 정보형 / 비교형 / 감성형
```

최소 3개, 최대 7개 Opportunity를 뽑는다.

### Step 7: 저장 및 보고
`outputs/ideas/YYMMDD_<slug>_research.md` 형식으로 저장. 파일 구조:

```markdown
# Research: [query]
- 수집일: YYYY-MM-DD
- 원본 데이터: outputs/raw/... (videos.json, comments.json)

## Meta Summary
- 영상 N개, 댓글 M개
- 쇼츠 비율: X%
- 조회수 중앙값: X회
- 상위 채널: [채널1], [채널2], [채널3]

## Comment Clusters
### ❓ Questions (상위 3개)
### 😤 Pain Points (상위 3개)
### 🔥 Validation (상위 3개)
### 💡 Requests (상위 3개)
### 🔄 Switching Stories (상위 3개)

## Content Opportunities
[위 형식대로 3–7개]

## Recommended Next Step
가장 점수 높은 Opportunity 1개를 지목하고,
"이걸로 바로 script-writer Skill을 호출할까요?"로 끝맺음.
```

저장 후 사용자에게 경로와 핵심 발견 3가지를 한국어로 짧게 요약 보고한다.

## Constraints
- 수집된 댓글이 30개 미만이면 "데이터 부족 — 더 많은 영상 수집 필요" 경고.
- 스크립트 코드 본문을 컨텍스트에 로드하지 않는다 (실행 결과만 사용).
- context/ 파일은 수정하지 않는다.
- 댓글 원문 인용 시 최대 한 줄, 15단어 이내로.

## Never Do
- Research 결과 없이 추측으로 "트렌드"를 말하지 않는다.
- 브랜드 가이드라인과 충돌하는 Opportunity는 제안하지 않는다.
- 사용자 승인 없이 여러 카테고리를 동시에 조사하지 않는다.
