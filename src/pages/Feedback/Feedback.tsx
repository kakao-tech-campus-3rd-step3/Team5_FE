import styled from '@emotion/styled';
import SharedButton from '../../shared/ui/SharedButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '../../routes/routePath';
import { useState } from 'react';
import type { GetFeedbackData } from '../../api/feedback';
import Card from './components/Card';

const questionData = {
  text: 'Q. Cookie와 Local Storage의 차이점이 무엇인가요?',
};

const answerData = {
  title: '나의 답변',
  content: ['내용'],
};

const FeedbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [memoContent, setMemoContent] = useState('');
  const feedbackResult = location.state as GetFeedbackData | undefined;

  const handleArchiveClick = () => {
    navigate(ROUTE_PATH.ARCHIVE);
  };

  return (
    <Wrapper>
      <SectionContainer>
          {/* TODO: API 응답에 질문 텍스트가 포함되어 있는지 확인 후 연결*/} 
          <QuestionText>{questionData.text}</QuestionText>
      </SectionContainer>


      <SectionContainer>
        <Title>나의 답변</Title>
        <Card>
          {answerData.content.map((paragraph, index) => (
            <CardParagraph key={index}>{paragraph}</CardParagraph>
          ))}
        </Card>
      </SectionContainer>

      <SectionContainer>
        <Title>AI 피드백</Title>

        <Card>
          <CardTitle>종합 평가</CardTitle>
          <CardParagraph>{feedbackResult?.overallEvaluation}</CardParagraph>
        </Card>
        
        <Card>
          <CardTitle>좋은 점</CardTitle>
          <CardList>
            {feedbackResult?.positivePoints.map((point, index) => (
              <CardListItem key={index}>{point}</CardListItem>
            ))}
          </CardList>
        </Card>

        <Card>
          <CardTitle>개선할 수 있는 점</CardTitle>
          <CardList>
            {feedbackResult?.pointsForImprovement.map((point, index) => (
              <CardListItem key={index}>{point}</CardListItem>
            ))}
          </CardList>
        </Card>
      </SectionContainer>

      <SectionContainer>
        <Title>메모</Title>
        <Card>
          <MemoTextArea
            value={memoContent}
            onChange={(e) => setMemoContent(e.target.value)}
            placeholder="메모를 작성해주세요."
          />
        </Card>
      </SectionContainer>

      <SharedButton type="button" onClick={handleArchiveClick} disabled={false}>
        아카이브로 이동
      </SharedButton>
    </Wrapper>
  );
};

const SectionContainer = styled.section`
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

const QuestionText = styled.h1`
  padding: 40px 30px;
  font-size: ${({ theme }) => theme.typography.fontSizes.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
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
  list-style-position: outside;
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

const MemoTextArea = styled.textarea`
  width: 90%;
  min-height: 120px;
  padding: 16px;
  border-radius: 8px;
  font-size: 1rem;
  color: #595959;

  &:focus {
    outline: none;
    border-color: #333;
  }
`;

export default FeedbackPage;
