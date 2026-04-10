---
name: comment-analyzer
description: Use this skill whenever the user wants to analyze YouTube comments that were already collected by yt_comments.py. Triggers on phrases like "댓글 분석해줘", "수요 분석", "사람들이 뭘 원하는지 정리", "페인 포인트 뽑아줘", or when the user points to a comments JSON file in outputs/raw/. This skill does not collect new data — it only reads existing JSON files and produces a structured demand analysis markdown. If the user has not yet run youtube-researcher, suggest that first.
---

# Comment Analyzer Skill

## Purpose
yt_comments.py가 수집한 JSON 파일을 읽어, 댓글을 **맥락 기반으로** 분류하고 콘텐츠 기회로 변환한다. 이 Skill은 새 데이터를 수집하지 않는다 — 오직 기존 JSON을 해석한다.

## When NOT to Invoke
- 수집된 comments JSON이 없을 때 → `youtube-researcher` 먼저 제안
- 사용자가 "새 데이터 수집" 을 원할 때 → `youtube-researcher` 호출
- 영상 메타만 있고 댓글이 없을 때 → `yt_comments.py` 먼저 실행 안내

## Mandatory Pre-Read (순서대로)
1. `context/brand.md` — 브랜드 보이스·금지어·평가 관점
2. `context/icp.md` — ICP 페인 / 검색어 패턴
3. 대상 comments JSON 파일 (사용자가 지정)

## Inputs
- **source** (필수): comments JSON 파일 경로
  예: `outputs/raw/260410_휴대용_유모차기_comments.json`
- **focus** (선택): 특정 관점으로 좁히기
  예: "구매 전 고민 중심", "전환 스토리 중심", "가격 언급 중심"

## Workflow

### Step 1: 입력 확인 및 Plan
- 지정된 JSON 파일이 존재하는지 확인 (Read 툴로)
- 파일이 없으면: "파일을 찾을 수 없어요. 경로 확인 부탁드려요." 로 종료
- 파일이 있으면: 상단 메타(source, video_count, total_comments)를 읽고 Plan 출력:
승인 전까지 다음 단계로 넘어가지 않는다.

### Step 2: 댓글 전체 읽기 + 1차 스캔
JSON의 `videos[].comments[]` 배열을 모두 읽는다.
각 댓글마다 머릿속으로 다음 태그를 붙인다 (출력 X, 내부 판단):
- 질문인가? (❓)
- 불만/실패 경험인가? (😤)
- 만족/추천인가? (🔥)
- 콘텐츠 요청인가? (💡)
- 전환 스토리인가? (🔄 "A에서 B로 바꿨다")
- 구매 고민인가? (🤔)

### Step 3: 카테고리 자동 발견 (중요)
**미리 정해진 토픽 리스트를 쓰지 말 것.**
이 카테고리의 고유한 관심사를 댓글에서 직접 발견한다.
예:
- 유모차 → "트렁크 수납", "계단 접기", "무게"
- 카시트 → "차량 호환", "ISOFIX 설치", "아이 편의"
- 분유제조기 → "분유 호환성", "세척", "새벽 소음"

카테고리는 **3~8개**, 너무 적으면 일반화, 너무 많으면 노이즈.
각 카테고리마다 대표 댓글 2~3개 (인용 시 최대 한 줄, 15단어 이내).

### Step 4: ICP 매칭 검증
각 카테고리가 `context/icp.md`의 Pain Points와 얼마나 맞는지 1~5점으로 스스로 채점.
3점 미만 카테고리는 "우리 ICP와 멀음" 으로 표시하고 우선순위 낮춤.

### Step 5: 콘텐츠 기회 추출
상위 카테고리들을 **쇼츠/롱폼에 즉시 쓸 수 있는 훅**으로 변환.
brand.md의 Structure 규칙 준수:
- 쇼츠 제목: 12자 이내, 숫자 포함
- 금지어 회피
- "단점부터 말한다" 보이스 반영

### Step 6: 저장
`outputs/ideas/YYMMDD_<slug>_demand.md` 로 저장. 슬러그는 원본 JSON의 source 필드에서 추출.

파일 구조:
```markdown
# Comment Demand Analysis: [카테고리명]
- 분석일: YYYY-MM-DD
- 원본: [comments JSON 경로]
- 영상 N개, 댓글 M개

## 🔥 Top Finding (30초 요약)
한 문단. 이 카테고리에서 가장 중요한 발견 1~2개.
이게 가장 먼저 와야 함 — 도요님이 바쁠 때 이것만 읽어도 되도록.

## 카테고리 분석
### 1. [발견된 카테고리명] (N건, ICP매칭 X/5)
- **왜 중요한가**: 한 문장
- **대표 댓글**:
  - "원문 인용" — 좋아요 N, 영상 [짧은 제목]
  - "원문 인용" — 좋아요 N
- **숨은 의미**: Claude의 해석 (이게 Python이 못 하는 부분)

### 2. [...]
...

## 콘텐츠 기회 TOP 5

### Opportunity 1: [쇼츠 제목 12자 이내]
- **포맷**: Short / Long / Both
- **근거 카테고리**: [위의 어떤 카테고리]
- **훅 초안 (0–2초)**: "..."
- **본문 요지**: 2~3줄
- **차별화**: 도요님이 어떤 각도로 다르게 다룰 수 있는가
- **Credibility Anchor**: 어떤 실측/증거를 붙일까

### Opportunity 2: [...]
...

## 건너뛸 것들 (ICP와 먼 카테고리)
- [카테고리]: 이유
...

## 추천 다음 단계
가장 점수 높은 Opportunity 1개를 지목.
"이걸로 script-writer Skill 호출할까요?"
```

### Step 7: 보고
사용자에게:
1. 저장 경로 알림
2. 🔥 Top Finding 한 문단 그대로 출력
3. "자세한 건 파일에서 확인하세요. 다음 단계 갈까요?"

## Constraints
- 댓글 원문 인용은 **한 줄, 15단어 이내**만 허용.
- 새 Python 스크립트를 만들지 않는다. 파일 읽기만.
- context/ 파일은 수정하지 않는다.
- 카테고리를 context/brand.md의 Vocabulary와 충돌하는 단어로 명명하지 않는다 ("혁신적", "최고의" 등).
- 데이터에 없는 내용은 절대 추측하지 않는다. "근거 부족" 이라고 적는다.

## Never Do
- "일반적으로 부모들은..." 같은 일반화. 반드시 이 JSON의 실제 댓글에서 출발.
- 브랜드 가이드라인과 충돌하는 Opportunity 제안.
- 한 응답에 여러 JSON 파일을 동시에 분석하지 않는다.
- 레퍼런스로 보존된 references/auto-generated-samples/ 를 읽지 않는다 (편향 방지).
