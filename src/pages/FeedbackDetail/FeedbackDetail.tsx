import styled from '@emotion/styled';
import SharedButton from '../../shared/ui/SharedButton';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Card from './components/Card';

const FeedbackDetailPage = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  const [memoContent, setMemoContent] = useState('');

  return (
    <Wrapper>
      <SectionContainer>
        <QuestionText>Q. dsfdsfsdfsdfsdfsdf</QuestionText>
      </SectionContainer>

      <SectionContainer>
        <Title>나의 답변</Title>
        <Card>dfsdsfsfsdfsdfsdfsd</Card>
      </SectionContainer>

      <SectionContainer>
        <Title>AI 피드백</Title>
        <Card>dfsdsfsfsdfsdfsdfsd</Card>
        <Card>dfsdsfsfsdfsdfsdfsd</Card>
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

      <SharedButton type="button" onClick={handleBackClick} disabled={false}>
        뒤로가기
      </SharedButton>
    </Wrapper>
  );
};

export default FeedbackDetailPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: ${({ theme }) => theme.space.space64};
  gap: ${({ theme }) => theme.space.space64} 0;
`;

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuestionText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.space.space32};
`;

const MemoTextArea = styled.textarea`
  width: 90%;
  height: 90%;
  padding: ${({ theme }) => theme.space.space16};
`;
