import { useEffect, useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import Lottie from 'lottie-react';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../../api/apiClient';
import LoadingAnimation from '../../../assets/lottie/loading3.json';
import { ROUTE_PATH } from '../../../routes/routePath';
import type { AnswerItem } from '../Archive';
import FilterSelector from './FilterSelector';

interface CursorAnswersApiResponse {
  items: AnswerItem[];
  nextId: number | null;
  nextCreatedAt: string | null;
  hasNext: boolean;
}

interface CursorState {
  nextId: number | null;
  nextCreatedAt: string | null;
  hasNext: boolean;
}

const QuestionList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 무한 스크롤 상태 관리
  const [items, setItems] = useState<AnswerItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // fetch 트리거 상태
  const [cursor, setCursor] = useState<CursorState>({
    // 커서 상태
    nextId: null,
    nextCreatedAt: null,
    hasNext: true, // 처음엔 true로 가정
  });

  const observer = useRef<IntersectionObserver | null>(null);

  // ✦ 추가: 마지막 아이템에 할당할 ref 콜백
  const lastItemRef = useCallback(
    (node: HTMLLIElement) => {
      if (isLoading || !cursor.hasNext) return;

      // 기존 observer 연결 해제
      if (observer.current) observer.current.disconnect();

      // 새 observer 생성
      observer.current = new IntersectionObserver((entries) => {
        // 마지막 요소가 보이고, 로딩 중이 아닐 때
        if (entries[0].isIntersecting && !isLoading) {
          setIsFetching(true); // 2단계: 다음 페이지 로드 트리거
        }
      });

      // 새 observer에 마지막 요소(node) 등록
      if (node) observer.current.observe(node);
    },
    [isLoading, cursor.hasNext] // 로딩상태나 hasNext가 바뀔 때마다 함수 재생성
  );

  // ✦ 추가 (1단계): 필터(searchParams) 변경 시, 상태 초기화 및 첫 페이지 로드 트리거
  useEffect(() => {
    setItems([]); // 아이템 초기화
    setCursor({ nextId: null, nextCreatedAt: null, hasNext: true }); // 커서 초기화
    setIsFetching(true); // "1단계: 첫 페이지 로드" 트리거
  }, [searchParams]);

  // ✦ 추가 (2/3단계): isFetching 트리거가 true가 되면 데이터 로드 실행
  useEffect(() => {
    // 트리거가 꺼져있으면 실행 안함
    if (!isFetching) return;

    // 이미 로딩 중이면 실행 안함
    if (isLoading) return;

    // 이 fetch가 "첫 페이지 로드"인지 "다음 페이지 로드"인지 판별
    const isReset = items.length === 0;

    // "다음 페이지 로드"인데, hasNext가 false이면 실행 중지
    if (!isReset && !cursor.hasNext) {
      setIsFetching(false); // 트리거 끄기
      return;
    }

    const fetchAnswers = async () => {
      setIsLoading(true); // 실제 로딩 시작

      // API 명세에 따른 파라미터 구성
      const params: Record<string, string | number> = {
        ...Object.fromEntries(searchParams.entries()),
        limit: 10,
      };

      // "다음 페이지 로드" (2단계)일 경우에만 커서 값 추가
      if (!isReset && cursor.nextId && cursor.nextCreatedAt) {
        params.lastId = cursor.nextId;
        params.lastCreatedAt = cursor.nextCreatedAt;
      }

      try {
        console.log('📤 [QuestionList] GET /api/answers 요청:', {
          url: '/api/answers',
          params,
          fullUrl: `/api/answers?${new URLSearchParams(params as Record<string, string>).toString()}`,
        });
        const response = await apiClient.get<CursorAnswersApiResponse>('/api/answers', { params });

        if (response.data) {
          const { items: newItems, ...newCursor } = response.data;

          setItems((prevItems) => (isReset ? newItems : [...prevItems, ...newItems]));

          setCursor(newCursor);
        }
      } catch (error) {
        console.error('Failed to fetch answers:', error);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchAnswers();
  }, [isFetching, isLoading, searchParams, cursor, items.length]);

  const handleItemClick = (id: number) => {
    navigate(generatePath(ROUTE_PATH.FEEDBACK_DETAIL, { id: String(id) }));
  };

  return (
    <Wrapper>
      <FilterSelector />
      <ListItemWrapper>
        {items.length > 0 ? (
          <>
            <ol>
              {items.map((q: AnswerItem, index: number) => {
                if (items.length === index + 1) {
                  return (
                    <ListItem
                      ref={lastItemRef}
                      key={`${q.answerId}-${index}`}
                      onClick={() => handleItemClick(q.answerId)}
                    >
                      {index + 1}. {q.questionText}
                    </ListItem>
                  );
                }
                return (
                  <ListItem
                    key={`${q.answerId}-${index}`}
                    onClick={() => handleItemClick(q.answerId)}
                  >
                    {index + 1}. {q.questionText}
                  </ListItem>
                );
              })}
            </ol>
            {isLoading && (
              <LottieWrapper>
                <Lottie animationData={LoadingAnimation} loop autoplay />
              </LottieWrapper>
            )}
          </>
        ) : isLoading ? (
          <LottieWrapper>
            <Lottie animationData={LoadingAnimation} loop autoplay />
          </LottieWrapper>
        ) : (
          <Wrapper>EMPTY</Wrapper>
        )}
      </ListItemWrapper>
    </Wrapper>
  );
};

export default QuestionList;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 100%;
  height: 100%;
  gap: ${({ theme }) => theme.space.space32};
  margin-bottom: ${({ theme }) => theme.space.space32};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const ListItemWrapper = styled.div`
  width: 90%;
  max-width: 900px;
  max-height: 50vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space.space16};

  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: ${({ theme }) => theme.blurs.blur4};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
`;

const ListItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSizes.bodys};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin: ${({ theme }) => theme.space.space12};
`;

const LottieWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 170px;
  height: auto;
  pointer-events: none;
`;
