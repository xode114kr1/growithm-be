export function parseBaekjoonReadme(text) {
  const result = {};

  // 1) 티어 + 제목 + 번호
  const titleMatch = text.match(/^# \[(.+?)\] (.+?) - (\d+)/m);
  if (titleMatch) {
    result.tier = titleMatch[1]; // Bronze IV
    result.title = titleMatch[2]; // 세수정렬
    result.problemId = titleMatch[3]; // 2752
  }

  // 2) 문제 링크
  const linkMatch = text.match(/\(https:\/\/www\.acmicpc\.net\/problem\/\d+\)/);
  if (linkMatch) {
    result.link = linkMatch[0].slice(1, -1); // 괄호 제거
  }

  // 3) 성능 요약 (메모리, 시간)
  const memoryMatch = text.match(/메모리:\s*([\d]+ KB)/);
  const timeMatch = text.match(/시간:\s*([\d]+ ms)/);
  if (memoryMatch) result.memory = memoryMatch[1];
  if (timeMatch) result.time = timeMatch[1];

  // 4) 분류
  const categoryMatch = text.match(/### 분류\s+([\s\S]+?)\n\n/);
  if (categoryMatch) {
    const categories = categoryMatch[1].trim().split(/,\s*/);
    result.categories = categories;
  }

  // 5) 제출 일자
  const dateMatch = text.match(/### 제출 일자\s+(.+)/);
  if (dateMatch) {
    result.submittedAt = dateMatch[1].trim();
  }

  // 6) 문제 설명
  const descMatch = text.match(/### 문제 설명\s+([\s\S]+)/);
  if (descMatch) {
    result.description = descMatch[1].trim();
  }

  return result;
}

export function parseProgrammersReadme(text) {
  const result = {};

  // 플랫폼 정보
  result.platform = "programmers";

  // 1) 레벨 + 제목 + 번호
  // 예: # [level 1] 신고 결과 받기 - 92334
  const titleMatch = text.match(/^# \[(.+?)\] (.+?) - (\d+)/m);
  if (titleMatch) {
    result.tier = titleMatch[1]; // level 1
    result.title = titleMatch[2]; // 신고 결과 받기
    result.problemId = titleMatch[3]; // 92334
  }

  // 2) 문제 링크
  const linkMatch = text.match(
    /\(https:\/\/school\.programmers\.co\.kr\/[^\)]+\)/
  );
  if (linkMatch) {
    result.link = linkMatch[0].slice(1, -1); // 괄호 제거
  }

  // 3) 성능 요약 (메모리, 시간)
  const memoryMatch = text.match(/메모리:\s*([\d.]+ MB)/);
  const timeMatch = text.match(/시간:\s*([\d.]+ ms)/);
  if (memoryMatch) result.memory = memoryMatch[1]; // "39.6 MB"
  if (timeMatch) result.time = timeMatch[1]; // "205.46 ms"

  // 4) 구분 (코딩테스트 연습 > 2022 KAKAO BLIND RECRUITMENT)
  const categoryMatch = text.match(/### 구분\s+(.+)\n/);
  if (categoryMatch) {
    const path = categoryMatch[1].replace(/\s+/g, " ").trim();
    // '>' 기준으로 나눠서 배열로 저장
    result.categories = path.split(">").map((s) => s.trim());
  }

  // 5) 채점결과 (정확성, 합계)
  const accuracyMatch = text.match(/정확성:\s*([\d.]+)%/);
  if (accuracyMatch) {
    result.accuracy = parseFloat(accuracyMatch[1]); // 100.0
  }

  const scoreMatch = text.match(/합계:\s*([\d.]+)\s*\/\s*([\d.]+)/);
  if (scoreMatch) {
    result.score = parseFloat(scoreMatch[1]); // 100.0
    result.scoreMax = parseFloat(scoreMatch[2]); // 100.0
  }

  // 6) 제출 일자
  const dateMatch = text.match(/### 제출 일자\s+(.+)/);
  if (dateMatch) {
    result.submittedAt = dateMatch[1].trim();
  }

  // 7) 문제 설명 (출처 앞까지만 잘라서)
  const descMatch = text.match(/### 문제 설명\s+([\s\S]+)/);
  if (descMatch) {
    const rawDesc = descMatch[1];
    const sourceIndex = rawDesc.indexOf("\n\n> 출처");
    result.description =
      sourceIndex !== -1
        ? rawDesc.slice(0, sourceIndex).trim()
        : rawDesc.trim();
  }

  return result;
}
