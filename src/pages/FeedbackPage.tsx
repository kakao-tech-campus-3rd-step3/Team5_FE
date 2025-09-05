import styled from '@emotion/styled';

const questionData = {
  text: 'Q. Cookie와 Local Storage의 차이점이 무엇인가요?',
};

const SectionContainer = styled.section`
  background-color: #ffffff;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #333333;
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

const TodayQuestion = () => {
  return (
    <SectionContainer>
      <Title>오늘의 질문</Title>
      <QuestionCard>
        <QuestionText>{questionData.text}</QuestionText>
      </QuestionCard>
    </SectionContainer>
  );
};

export default TodayQuestion;