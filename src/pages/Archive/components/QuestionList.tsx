import styled from '@emotion/styled';
import { questionDatas } from '../datas/questionDatas';

const QuestionList = () => {
  return (
    <Wrapper>
      <ListItemWrapper>
        <ol>
          {questionDatas.map((data, index) => (
            <ListItem key={data.id}>
              {index + 1}. {data.question}
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
