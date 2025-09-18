import styled from '@emotion/styled';

interface QuestionCardSectionProps {
  isStarted: boolean;
}

const QuestionCardSection = ({ isStarted }: QuestionCardSectionProps) => {
  return (
    <section>
      <QuestionCard isStarted={isStarted === true}>
        <GlassBackground>
          {isStarted
            ? 'Cookie와 Local Storage의 차이점이 무엇인가요?'
            : '오늘의 질문을 확인하세요!'}
        </GlassBackground>
      </QuestionCard>
    </section>
  );
};

export default QuestionCardSection;

const QuestionCard = styled.div<{ isStarted: boolean }>`
  width: 300px;
  height: ${(props) => (props.isStarted ? '150px' : '300px')};

  transition: 0.3s ease-in-out;
`;

const GlassBackground = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(24px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
