# WISTIA 홈페이지

웨딩·프로포즈·축가 전문 보컬 레코딩 및 영상 제작 브랜드 WISTIA의 공식 웹사이트입니다

## 기술 구성

- GitHub: 소스 버전 관리
- Vercel: 정적 사이트 및 API 배포
- Supabase: 향후 상담·콘텐츠 데이터 연동 기반

## 로컬 실행

```bash
npx serve .
```

SEO 경로별 정적 HTML은 `node scripts/prerender.mjs`로 생성합니다
제목·설명은 `js/seo-meta.js`에서 공통 관리하며, 변경 후 생성 스크립트를 다시 실행해야 합니다
기존 `#/detail/...` 주소는 브라우저에서 `/detail/...` 경로로 치환합니다

## Vercel 배포

GitHub 저장소를 Vercel에서 Import한 뒤 배포합니다

Supabase 연결 시 Vercel 환경 변수에 `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`를 등록합니다

`SUPABASE_SECRET_KEY`는 서버 전용이며 브라우저 코드나 GitHub에 포함하지 않습니다

SNS·영상·상담 링크는 `wistia-config.json`에서 관리합니다

`.env` 파일과 비밀 키는 커밋하지 않습니다
