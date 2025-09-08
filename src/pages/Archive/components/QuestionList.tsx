import styled from '@emotion/styled';
import { questionDatas } from '../datas/questionDatas';

const QuestionList = () => {
  return (
    <GlassBackground>
      <ListItemWrapper>
        <ol>
          {questionDatas.map((data, index) => (
            <ListItem key={data.id}>
              {index + 1}. {data.question}
            </ListItem>
          ))}
        </ol>
      </ListItemWrapper>
    </GlassBackground>
  );
};

export default QuestionList;

const ListItem = styled.li`
  font-size: 1.2rem;
  font-weight: 700;
  padding-bottom: 10px;
`;

const GlassBackground = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  width: 50%;
  height: 70%;

  display: flex;
`;

const ListItemWrapper = styled.div`
  max-width: 80%;
  margin: auto;
`;
