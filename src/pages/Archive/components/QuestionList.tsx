import styled from '@emotion/styled';
import { ROUTE_PATH } from '../../../routes/routePath';
import { useNavigate } from 'react-router-dom';

const QuestionList = ({ data }: any) => {
  const items = data?.items;
  const navigate = useNavigate();

  const handleItemClick = () => {
    // TODO: id 값에 따라 동적라우팅 구현
    navigate(ROUTE_PATH.FEEDBACK_DETAIL);
  };

  if (!items || items.length === 0) return;
  return (
    <Wrapper>
      <ListItemWrapper>
        <ol>
          {items.map((q: any, index: any) => (
            <ListItem key={q.answerId} onClick={handleItemClick}>
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
  padding: ${({ theme }) => theme.space.space16};

  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: ${({ theme }) => theme.blurs.blur4};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  width: 90%;
  max-width: 900px;
  max-height: 70%;
  margin-bottom: ${({ theme }) => theme.space.space32};
`;

const ListItemWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const ListItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSizes.bodys};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin: ${({ theme }) => theme.space.space12};
`;
