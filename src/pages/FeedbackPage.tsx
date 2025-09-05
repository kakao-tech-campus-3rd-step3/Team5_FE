import styled from '@emotion/styled';

const questionData = {
  text: 'Q. Cookie와 Local Storage의 차이점이 무엇인가요?',
};

const answerData = {
  title: '나의 답변',
  content: [
    '내용',
  ],
};

const SectionContainer = styled.section`
  background-color: #ffffff;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const PageLayout = styled.div`
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
  background-color: #fffaf0;
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
  background-color: #fffaf0;
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

const FeedbackPage = () => {
  return (
    <PageLayout>
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
    </PageLayout>
  );
};

export default FeedbackPage;
