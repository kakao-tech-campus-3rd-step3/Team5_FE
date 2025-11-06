import { useEffect, useState, useRef, useCallback } from 'react';

import styled from '@emotion/styled';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';

import apiClient from '../../../api/apiClient';
import { ROUTE_PATH } from '../../../routes/routePath';
import useFetch from '../../../shared/hooks/useFetch';

import type { AnswerItem } from '../Archive';

const filters = [
  { id: 'ALL', label: '전체' },
  { id: 'level', label: '난이도' },
  { id: 'jobId', label: '직군별' },
  { id: 'questionType', label: '질문 타입' },
] as const;

const levels = [
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
] as const;

const questionTypes = [
  { id: 'PERSONALITY', label: '인성' },
  { id: 'MOTIVATION', label: '동기' },
  { id: 'TECH', label: '기술' },
] as const;

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

interface Occupation {
  occupationId: number;
  occupationName: string;
}

type OccupationsApiResponse = Occupation[];

const QuestionList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedDefault, setSelectedDefault] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>();
  const [selectedType, setSelectedType] = useState<string>();
  const [selectedOccupation, setSelectedOccupation] = useState<string>();

  const [isLevelSelected, setIsLevelSelected] = useState(false);
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [isStarredSelected, setIsStarredSelected] = useState(false);
  const [isOccupationSelected, setIsOccupationSelected] = useState(false);

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
        // API 호출
        console.log('📤 [QuestionList] GET /api/answers 요청:', {
          url: '/api/answers',
          params,
          fullUrl: `/api/answers?${new URLSearchParams(params as Record<string, string>).toString()}`,
        });
        const response = await apiClient.get<CursorAnswersApiResponse>('/api/answers', { params });

        if (response.data) {
          const { items: newItems, ...newCursor } = response.data;

          // 1단계(초기화)면 덮어쓰고, 2단계(다음)면 누적
          setItems((prevItems) => (isReset ? newItems : [...prevItems, ...newItems]));

          // 새 커서 값으로 덮어쓰기
          setCursor(newCursor);
        }
      } catch (error) {
        console.error('Failed to fetch answers:', error);
      } finally {
        setIsLoading(false); // 로딩 종료
        setIsFetching(false); // 트리거 끄기 (중요: 루프 방지)
      }
    };

    fetchAnswers();
  }, [isFetching, isLoading, searchParams, cursor, items.length]);

  // ✦ 수정: occupations fetch에서 params 제거 (params 상태가 없어졌으므로)
  const { data: occupations } = useFetch<OccupationsApiResponse>('/api/occupations');

  const handleItemClick = (id: number) => {
    navigate(generatePath(ROUTE_PATH.FEEDBACK_DETAIL, { id: String(id) }));
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    setIsLevelSelected(false);
    setIsTypeSelected(false);
    setSelectedDefault(false);
    setIsOccupationSelected(false);

    switch (filterId) {
      case 'level':
        setIsLevelSelected(true);
        break;
      case 'jobId':
        setIsOccupationSelected(true);
        break;
      case 'questionType':
        setIsTypeSelected(true);
        break;
      case 'ALL':
        setSearchParams({}, { replace: true });
        setSelectedDefault(true);
        setIsStarredSelected(false);
        break;
      default:
        break;
    }
  };

  const handleStarredClick = () => {
    const nextIsStarredSelected = !isStarredSelected;
    setIsStarredSelected(nextIsStarredSelected);
    if (nextIsStarredSelected) {
      setSearchParams({ starred: String(nextIsStarredSelected) }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleLevelClick = (levelId: string) => {
    setSelectedLevel(levelId);
    setSearchParams({ level: levelId }, { replace: true });
  };

  const handleTypeClick = (typeId: string) => {
    setSelectedType(typeId);
    setSearchParams({ questionType: typeId }, { replace: true });
  };

  const handleOccupationClick = (occupationName: string) => {
    // ... (기존과 동일)
    setSelectedOccupation(occupationName);
    setSearchParams({ jobId: occupationName }, { replace: true });
  };

  return (
    <Wrapper>
      {/* ... (필터 UI 렌더링 코드는 기존과 동일) ... */}
      <FilterWrapper>
        {filters.map((filter) => (
          <FilterButton
            key={filter.id}
            selected={selectedFilter === filter.id}
            onClick={() => handleFilterChange(filter.id)}
          >
            {filter.label}
          </FilterButton>
        ))}
      </FilterWrapper>

      {selectedDefault && (
        <FilterWrapper>
          <FilterButton selected={isStarredSelected === true} onClick={handleStarredClick}>
            즐겨찾기
          </FilterButton>
        </FilterWrapper>
      )}

      {isLevelSelected && (
        <FilterWrapper>
          {levels.map((level) => (
            <FilterButton
              key={level.id}
              selected={selectedLevel === level.id}
              onClick={() => handleLevelClick(level.id)}
            >
              {level.label}
            </FilterButton>
          ))}
        </FilterWrapper>
      )}

      {isOccupationSelected && (
        <FilterWrapper>
          {occupations?.map((occupation) => (
            <FilterButton
              key={occupation.occupationId}
              selected={selectedOccupation === occupation.occupationId.toString()}
              onClick={() => handleOccupationClick(occupation.occupationId.toString())}
            >
              {occupation.occupationName}
            </FilterButton>
          ))}
        </FilterWrapper>
      )}

      {isTypeSelected && (
        <FilterWrapper>
          {questionTypes.map((type) => (
            <FilterButton
              key={type.id}
              selected={selectedType === type.id}
              onClick={() => handleTypeClick(type.id)}
            >
              {type.label}
            </FilterButton>
          ))}
        </FilterWrapper>
      )}

      {/* ✦ 수정: 렌더링 로직을 data.items 대신 state의 items로 변경 */}
      {items.length > 0 ? (
        <ListItemWrapper>
          <ol>
            {/* ✦ 수정: items?.map -> items.map */}
            {items.map((q: AnswerItem, index: number) => {
              // ✦ 추가: 마지막 아이템인지 확인
              if (items.length === index + 1) {
                return (
                  // ✦ 추가: 마지막 아이템에 ref 할당
                  <ListItem
                    ref={lastItemRef}
                    key={`${q.answerId}-${index}`} // ✦ 수정: key를 더 고유하게 변경
                    onClick={() => handleItemClick(q.answerId)}
                  >
                    {index + 1}. {q.questionText}
                  </ListItem>
                );
              }
              // ✦ 수정: 나머지 아이템
              return (
                <ListItem
                  key={`${q.answerId}-${index}`} // ✦ 수정: key를 더 고유하게 변경
                  onClick={() => handleItemClick(q.answerId)}
                >
                  {index + 1}. {q.questionText}
                </ListItem>
              );
            })}
          </ol>
          {/* ✦ 추가: 로딩 스피너 */}
          {isLoading && <LoadingSpinner>Loading...</LoadingSpinner>}
        </ListItemWrapper>
      ) : (
        // ✦ 수정: 로딩 중이 아닐 때만 "EMPTY" 표시
        !isLoading && (
          <ListItemWrapper>
            <Wrapper>EMPTY</Wrapper>
          </ListItemWrapper>
        )
      )}
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

const FilterWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.space8};

  width: auto;
  height: auto;
  padding: ${({ theme }) => theme.space.space8} ${({ theme }) => theme.space.space12};

  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: ${({ theme }) => theme.blurs.blur4};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
`;

const FilterButton = styled.button<{ selected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSizes.bodys};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  background: ${({ selected }) => (selected ? 'rgba(255, 255, 255, 0.3)' : 'transparent')};
  padding: ${({ theme }) => theme.space.space4} ${({ theme }) => theme.space.space8};
  border-radius: ${({ theme }) => theme.radius.radius24};

  transition: background 0.2s;
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #888;
`;
