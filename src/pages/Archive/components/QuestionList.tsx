import styled from '@emotion/styled';
import { ROUTE_PATH } from '../../../routes/routePath';
import { generatePath, useNavigate } from 'react-router-dom';
import type { AnswerItem, AnswersApiResponse } from '../Archive';
import { useEffect, useState } from 'react';

interface QuestionListProps {
  data: AnswersApiResponse | null;
}

type FilterType = 'ALL' | 'PINNED' | 'LEVEL' | 'OCCUPATION' | 'TYPE';

const QuestionList = ({ data }: QuestionListProps) => {
  const [items, setItems] = useState(data?.items);

  const navigate = useNavigate();

  const handleItemClick = (id: number) => {
    navigate(generatePath(ROUTE_PATH.FEEDBACK_DETAIL, { id: String(id) }));
  };

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  useEffect(() => {
    switch (selectedFilter) {
      case 'PINNED':
        setItems(data?.items.filter((q: AnswerItem) => q.starred));
        break;
      // 다른 필터 조건도 추가 가능
      case 'ALL':
      default:
        setItems(data?.items);
        break;
    }
  }, [selectedFilter, data]);

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
          onClick={() => handleFilterChange('LEVEL')}
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
