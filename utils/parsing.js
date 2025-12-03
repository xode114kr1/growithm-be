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
