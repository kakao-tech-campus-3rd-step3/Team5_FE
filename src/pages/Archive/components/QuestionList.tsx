import styled from '@emotion/styled';
import { ROUTE_PATH } from '../../../routes/routePath';
import { generatePath, useNavigate, useSearchParams } from 'react-router-dom';
import type { AnswerItem, AnswersApiResponse } from '../Archive';
import { useEffect, useState } from 'react';
import useFetch from '../../../shared/hooks/useFetch';

// type FilterType = 'ALL' | 'PINNED' | 'LEVEL' | 'OCCUPATION' | 'TYPE';
type RankType = '1' | '2' | '3' | '4' | '5';

const filters = [
  { id: 'ALL', label: '전체' },
  { id: 'starred', label: '즐겨찾기' },
  { id: 'level', label: '난이도' },
  { id: 'OCCUPATION', label: '직군별' },
  { id: 'questionType', label: '질문 타입' },
];

const levels = [
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
];

const questionTypes = [
  { id: 'PERSONALITY', label: '인성' },
  { id: 'TECH', label: '기술' },
];

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

  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>();
  const [selectedType, setSelectedType] = useState<string>();

  const [isLevelSelected, setIsLevelSelected] = useState(false);
  const [isTypeSelected, setIsTypeSelected] = useState(false);

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    if (filterId !== 'level' || 'questionType') {
      setIsLevelSelected(false);
      setIsTypeSelected(false);
    }

    let newSearchParams = {};

    switch (filterId) {
      case 'starred':
        newSearchParams = { [filterId]: 'true' };
        break;
      case 'level':
        setIsLevelSelected(true);
        break;
      case 'OCCUPATION':
        break;
      case 'questionType':
        setIsTypeSelected(true);
        break;
      case 'ALL':
      default:
        newSearchParams = {};
        break;
    }
    if (filterId !== 'level' || 'questionType') {
      setSearchParams(newSearchParams, { replace: true });
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

  if (!items || items.length === 0) return null;
  return (
    <Wrapper>
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
