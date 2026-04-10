"""
yt_search.py — YouTube Data API v3 기반 영상 검색
사용법:
  python scripts/yt_search.py "원목침대 아기" --max 20
  python scripts/yt_search.py "미마 유모차" --max 30 --order viewCount

출력: outputs/raw/YYMMDD_<slug>_videos.json
"""
import os
import sys
import json
import argparse
import re
from datetime import datetime
from pathlib import Path

try:
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError
except ImportError:
    print("❌ google-api-python-client 패키지가 없습니다.")
    print("   실행: pip install google-api-python-client")
    sys.exit(1)

# 프로젝트 루트 찾기 (scripts/ 상위)
ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = ROOT / "outputs" / "raw"


def get_api_key():
    """환경변수 또는 .env 파일에서 API 키를 읽는다."""
    key = os.environ.get("YOUTUBE_API_KEY")
    if key:
        return key
    # .env 파일 백업 경로
    try:
        from dotenv import load_dotenv
        load_dotenv(ROOT / ".env")
        key = os.environ.get("YOUTUBE_API_KEY")
    except ImportError:
        pass
    if not key:
        print("❌ YOUTUBE_API_KEY 환경변수가 설정되지 않았습니다.")
        print("   PowerShell에서: echo $env:YOUTUBE_API_KEY")
        sys.exit(1)
    return key


def slugify(text: str) -> str:
    """파일명용 안전한 문자열 변환 (한글 유지)."""
    text = re.sub(r"[\\/:*?\"<>|]", "", text)
    text = re.sub(r"\s+", "_", text.strip())
    return text[:40]


def search_videos(youtube, query: str, max_results: int, order: str):
    """search.list → 영상 ID 리스트 반환."""
    ids = []
    token = None
    per_page = min(50, max_results)
    while len(ids) < max_results:
        req = youtube.search().list(
            q=query,
            part="id",
            type="video",
            order=order,
            maxResults=per_page,
            pageToken=token,
            regionCode="KR",
            relevanceLanguage="ko",
        )
        res = req.execute()
        ids.extend([item["id"]["videoId"] for item in res.get("items", [])])
        token = res.get("nextPageToken")
        if not token:
            break
    return ids[:max_results]


def fetch_video_details(youtube, video_ids):
    """videos.list → 상세 메타데이터."""
    details = []
    # videos.list는 한 번에 50개까지
    for i in range(0, len(video_ids), 50):
        chunk = video_ids[i:i+50]
        req = youtube.videos().list(
            id=",".join(chunk),
            part="snippet,statistics,contentDetails",
        )
        res = req.execute()
        for item in res.get("items", []):
            s = item["snippet"]
            stats = item.get("statistics", {})
            cd = item.get("contentDetails", {})
            details.append({
                "video_id": item["id"],
                "title": s.get("title"),
                "channel": s.get("channelTitle"),
                "channel_id": s.get("channelId"),
                "published_at": s.get("publishedAt"),
                "description": s.get("description", "")[:500],  # 500자 제한
                "tags": s.get("tags", []),
                "duration": cd.get("duration"),  # ISO 8601
                "view_count": int(stats.get("viewCount", 0)),
                "like_count": int(stats.get("likeCount", 0)),
                "comment_count": int(stats.get("commentCount", 0)),
                "url": f"https://www.youtube.com/watch?v={item['id']}",
                "thumbnail": s.get("thumbnails", {}).get("high", {}).get("url"),
            })
    return details


def main():
    parser = argparse.ArgumentParser(description="YouTube 영상 검색 및 메타데이터 수집")
    parser.add_argument("query", help="검색 키워드")
    parser.add_argument("--max", type=int, default=20, help="최대 영상 수 (기본: 20)")
    parser.add_argument("--order", default="relevance",
                        choices=["relevance", "viewCount", "date", "rating"],
                        help="정렬 기준 (기본: relevance)")
    args = parser.parse_args()

    api_key = get_api_key()
    youtube = build("youtube", "v3", developerKey=api_key)

    print(f"🔍 검색 중: \"{args.query}\" (최대 {args.max}개, 정렬: {args.order})")

    try:
        ids = search_videos(youtube, args.query, args.max, args.order)
        if not ids:
            print("⚠️  검색 결과가 없습니다.")
            sys.exit(0)
        print(f"   → {len(ids)}개 영상 ID 수집")

        videos = fetch_video_details(youtube, ids)
        # 조회수 내림차순 정렬
        videos.sort(key=lambda x: x["view_count"], reverse=True)

    except HttpError as e:
        print(f"❌ API 에러: {e}")
        if "quotaExceeded" in str(e):
            print("   → 일일 쿼터(10,000 units) 초과. 내일 다시 시도하세요.")
        sys.exit(1)

    # 저장
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    date_str = datetime.now().strftime("%y%m%d")
    filename = f"{date_str}_{slugify(args.query)}_videos.json"
    out_path = OUTPUT_DIR / filename

    payload = {
        "query": args.query,
        "order": args.order,
        "collected_at": datetime.now().isoformat(),
        "count": len(videos),
        "videos": videos,
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"✅ 저장 완료: {out_path}")
    print(f"   총 {len(videos)}개 영상")
    print(f"   조회수 1위: {videos[0]['title']} ({videos[0]['view_count']:,}회)")
    print(f"   조회수 중앙값: {videos[len(videos)//2]['view_count']:,}회")


if __name__ == "__main__":
    main()
