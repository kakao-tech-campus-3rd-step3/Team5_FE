import { useState } from 'react';

import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTE_PATH } from '../../routes/routePath';
import SharedButton from '../../shared/ui/SharedButton';

import Card from './components/Card';

import type { GetFeedbackData } from '../../api/feedback';

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
  // const [memoContent, setMemoContent] = useState('');
  // const feedbackResult = location.state as GetFeedbackData | undefined;
  const { result: feedbackResult, answerId } = (location.state || {}) as {
    result?: GetFeedbackData;
    answerId?: number;
  };

  const [memoContent, setMemoContent] = useState(() => {
    if (!answerId) return '';
    return localStorage.getItem(`memo_${answerId}`) || '';
  });

  const handleArchiveClick = () => {
    navigate(ROUTE_PATH.ARCHIVE);
  };

  const handleSaveMemo = () => {
    if (!answerId) {
      alert('메모를 저장하기 위한 답변 ID가 없습니다.');
      return;
    }
    try {
      localStorage.setItem(`memo_${answerId}`, memoContent);
      alert('메모가 브라우저에 저장되었습니다!');
    } catch (error) {
      console.error('메모 저장 실패:', error);
      alert('메모 저장에 실패했습니다.');
    }
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
          <SharedButton type="button" onClick={handleSaveMemo} disabled={false}>
            메모 저장
          </SharedButton>
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
  font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.space.space24};
`;

const QuestionText = styled.h1`
  padding: ${({ theme }) => theme.space.space40} ${({ theme }) => theme.space.space32};
  font-size: ${({ theme }) => theme.typography.fontSizes.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const CardParagraph = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: 1.5em;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.space20};
  text-align: center;
`;

const CardList = styled.ul`
  list-style-position: outside;
  padding-left: ${({ theme }) => theme.space.space20};
`;

const CardListItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space.space16};
  }
`;

const MemoTextArea = styled.textarea`
  width: 90%;
  min-height: 120px;
  padding: ${({ theme }) => theme.space.space16};
  border-radius: ${({ theme }) => theme.radius.radius8};
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

export default FeedbackPage;
