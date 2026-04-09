# CLAUDE.md — AI Agency Operating System

## 🎯 Mission
육아·제품리뷰 콘텐츠 제작·분석 자동화 시스템.
모든 작업은 Research → Plan → Execute → Review 4단계를 따른다.

## 🗺️ Directory Map
- `context/` — 불변 정체성. 외부 산출물은 여기를 먼저 읽는다.
  - `brand.md` / `icp.md` / `offer.md`
- `skills/` — 작업별 매뉴얼. 작업 시작 전 해당 SKILL.md 로드.
- `references/` — 라이브러리. 필요할 때만 읽는다.
- `scripts/` — Python 자동화. 코드 본문은 로드하지 말고 실행 결과만 사용.
- `outputs/` — 산출물. 파일명 규칙: `YYMMDD_주제_타입.md`
  - `raw/` — 수집된 원시 데이터 (JSON/CSV)
  - `ideas/` — 콘텐츠 기회 (연구 결과)
  - `scripts/` — 완성된 대본
  - `reports/` — 성과 분석

## 🔄 Content Creation Pipeline (표준 흐름)
새 콘텐츠 제작 요청이 오면 반드시 이 순서:

1. **Research** (skills/youtube-researcher)
   - 유사 영상 탐색 → 메타데이터 수집
   - 결과: `outputs/raw/YYMMDD_<topic>_videos.json`

2. **Demand Analysis** (skills/comment-analyzer)
   - 상위 영상 댓글 → 소비자 수요·페인 추출
   - 결과: `outputs/ideas/YYMMDD_<topic>_demand.md`

3. **Benchmark** (skills/script-benchmarker)
   - 고성과 영상의 훅·구조 패턴 추출
   - 결과: `outputs/ideas/YYMMDD_<topic>_patterns.md`

4. **Write** (skills/script-writer)
   - 위 3개 산출물 + context/ → 대본 작성
   - 결과: `outputs/scripts/YYMMDD_<title>.md`

사용자가 "바로 대본 써줘"라고 해도, Research 결과가 없으면 반드시 1단계부터 제안한다.

## ⚙️ Working Rules
1. **Plan First**: 어떤 작업이든 먼저 계획을 출력하고 승인 후 실행.
2. **Context Hygiene**: 한 번에 한 Skill만 로드.
3. **Brand Lock**: 외부 콘텐츠 생성 시 반드시 context/brand.md를 먼저 읽는다.
4. **Data-Driven**: 추측 금지. 주장은 outputs/raw/ 또는 outputs/ideas/의 실제 데이터 인용.
5. **Output Convention**: 결과물은 `outputs/<카테고리>/YYMMDD_제목.md`로 저장.

## 🛑 Never Do
- context/ 파일을 사용자 명시 요청 없이 수정하지 않는다.
- Research 없이 대본을 작성하지 않는다.
- 수집한 데이터 없이 "트렌드입니다" 같은 일반화를 하지 않는다.
- 한 응답에 여러 Skill을 동시에 로드하지 않는다.
