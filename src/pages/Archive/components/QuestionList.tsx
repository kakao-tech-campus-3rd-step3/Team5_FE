import styled from '@emotion/styled';
import { ROUTE_PATH } from '../../../routes/routePath';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';
import type { AnswerItem, AnswersApiResponse } from '../Archive';
import { useEffect, useState } from 'react';
import useFetch from '../../../shared/hooks/useFetch';

type FilterType = 'ALL' | 'PINNED' | 'LEVEL' | 'OCCUPATION' | 'TYPE';
type RankType = '1' | '2' | '3' | '4' | '5';

const QuestionList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState(Object.fromEntries(searchParams.entries()));

  useEffect(() => {
    const newParams = Object.fromEntries(searchParams.entries());
    console.log('URL 변경 감지! 새로운 요청 파라미터:', newParams);

    setParams(newParams);
  }, [searchParams]);
  const { data } = useFetch<AnswersApiResponse>('/api/answers', { params });
  const items = data?.items;
  console.log(items);

  const navigate = useNavigate();

  const handleItemClick = (id: number) => {
    navigate(generatePath(ROUTE_PATH.FEEDBACK_DETAIL, { id: String(id) }));
  };

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');
  const [selectedRank, setSelectedRank] = useState<RankType>('3');

  const handleFilterChange = (filter: FilterType, rank?: RankType) => {
    setSelectedFilter(filter);
    if (rank) {
      setSelectedRank(rank);
    }
  };

  useEffect(() => {
    switch (selectedFilter) {
      case 'ALL':
        setSearchParams({});
        break;
      case 'PINNED':
        setSearchParams({ starred: 'true' });
        break;
      case 'LEVEL':
        setSearchParams({ level: `${selectedRank}` });
        break;
      default:
        break;
    }
  }, [selectedFilter, selectedRank]);

  if (!items || items.length === 0) return null;
  return (
    <Wrapper>
      <FilterWrapper>
        <FilterButton selected={selectedFilter === 'ALL'} onClick={() => handleFilterChange('ALL')}>
          전체
        </FilterButton>
        <FilterButton
          selected={selectedFilter === 'PINNED'}
          onClick={() => handleFilterChange('PINNED')}
        >
          즐겨찾기
        </FilterButton>
        <FilterButton
          selected={selectedFilter === 'LEVEL'}
          onClick={() => handleFilterChange('LEVEL', selectedRank)}
        >
          난이도
        </FilterButton>
        <FilterButton
          selected={selectedFilter === 'OCCUPATION'}
          onClick={() => handleFilterChange('OCCUPATION')}
        >
          직군별
        </FilterButton>
        <FilterButton
          selected={selectedFilter === 'TYPE'}
          onClick={() => handleFilterChange('TYPE')}
        >
          퀘스천 타입
        </FilterButton>
      </FilterWrapper>

      <FilterWrapper>
        <FilterButton selected={selectedRank === '1'} onClick={() => setSelectedRank('1')}>
          1
        </FilterButton>
        <FilterButton selected={selectedRank === '2'} onClick={() => setSelectedRank('2')}>
          2
        </FilterButton>
        <FilterButton selected={selectedRank === '3'} onClick={() => setSelectedRank('3')}>
          3
        </FilterButton>
        <FilterButton selected={selectedRank === '4'} onClick={() => setSelectedRank('4')}>
          4
        </FilterButton>
        <FilterButton selected={selectedRank === '5'} onClick={() => setSelectedRank('5')}>
          5
        </FilterButton>
      </FilterWrapper>

      <FilterWrapper>
        <FilterButton selected={selectedFilter === 'TYPE'}>기술</FilterButton>
        <FilterButton selected={selectedFilter === 'TYPE'}>인성</FilterButton>
        <FilterButton selected={selectedFilter === 'TYPE'}>컬쳐핏</FilterButton>
      </FilterWrapper>

      <ListItemWrapper>
        <ol>
          {items.map((q: AnswerItem, index: number) => (
            <ListItem key={q.answerId} onClick={() => handleItemClick(q.answerId)}>
              {index + 1}. {q.questionText}
            </ListItem>
          ))}
        </ol>
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

const FilterButton = styled.button<{ selected: boolean | RankType }>`
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
  max-height: 70%;
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
