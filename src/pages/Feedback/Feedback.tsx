import styled from '@emotion/styled';
import SharedButton from '../../shared/ui/SharedButton';
import { useNavigate } from 'react-router-dom';

const questionData = {
  text: 'Q. Cookie와 Local Storage의 차이점이 무엇인가요?',
};

const answerData = {
  title: '나의 답변',
  content: ['내용'],
};

const memo = {
  title: '메모',
  content: ['내용'],
};

interface TopicGroupData {
  topic: string;
  points: string[];
}

const goodPointsData = {
  title: '좋은 점',
  content: [
    {
      topic: '주제1',
      points: ['내용', '내용'],
    },
    {
      topic: '주제2',
      points: ['내용', '내용'],
    },
  ],
};

const improvementPointsData = {
  title: '개선할 수 있는 점',
  content: [
    {
      topic: '주제1',
      points: ['내용', '내용'],
    },
  ],
};

const FeedbackPage = () => {
  const navigator = useNavigate();

  const handleArchiveClick = () => {
  navigator('/archive');
}

  return (
    <Wrapper>
      <SectionContainer>
        <Title>오늘의 질문</Title>
        <QuestionCard>
          <QuestionText>{questionData.text}</QuestionText>
        </QuestionCard>
      </SectionContainer>

      <SectionContainer>
        <Title>나의 답변</Title>
        <CardWrapper>
          {answerData.content.map((paragraph, index) => (
            <CardParagraph key={index}>{paragraph}</CardParagraph>
          ))}
        </CardWrapper>
      </SectionContainer>

      <SectionContainer>
        <Title>AI 피드백</Title>

        <CardWrapper>
          <CardTitle>{goodPointsData.title}</CardTitle>
          <CardList>
            {goodPointsData.content.map((group: TopicGroupData, index: number) => (
              <TopicGroup key={index}>
                <TopicTitle>{group.topic}</TopicTitle>
                <CardList>
                  {group.points.map((point: string, pointIndex: number) => (
                    <CardListItem key={pointIndex}>{point}</CardListItem>
                  ))}
                </CardList>
              </TopicGroup>
            ))}
          </CardList>
        </CardWrapper>
      </SectionContainer>
      <SectionContainer>
        <CardWrapper>
          <CardTitle>{improvementPointsData.title}</CardTitle>
          <CardList>
            {improvementPointsData.content.map((group: TopicGroupData, index: number) => (
              <TopicGroup key={index}>
                <TopicTitle>{group.topic}</TopicTitle>
                <CardList>
                  {group.points.map((point: string, pointIndex: number) => (
                    <CardListItem key={pointIndex}>{point}</CardListItem>
                  ))}
                </CardList>
              </TopicGroup>
            ))}
          </CardList>
        </CardWrapper>
      </SectionContainer>

      <SectionContainer>
        <Title>메모</Title>
        <CardWrapper>
          {memo.content.map((paragraph, index) => (
            <CardParagraph key={index}>{paragraph}</CardParagraph>
          ))}
        </CardWrapper>
      </SectionContainer>

      <SharedButton 
        type="button"
        onClick={handleArchiveClick}
        disabled={false}>
        아카이브로 이동 
      </SharedButton>
    </Wrapper>
  );
};

const SectionContainer = styled.section`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: rgb(0, 0, 0);
  margin-bottom: 24px;
`;

const QuestionCard = styled.div`
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 25px 30px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const QuestionText = styled.p`
  font-size: 1rem;
  color: #454545;
`;

const CardWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const CardParagraph = styled.p`
  font-size: 1rem;
  color: #595959;
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: 1.5em;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const CardList = styled.ul`
  list-style-position: inside;
  padding-left: 8px;
`;

const CardListItem = styled.li`
  font-size: 1rem;
  color: #595959;
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: 1em;
  }
`;

const TopicGroup = styled.div`
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`;

const TopicTitle = styled.h4`
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
`;

export default FeedbackPage;
