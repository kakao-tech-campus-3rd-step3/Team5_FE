import { useState } from 'react';
import styled from '@emotion/styled';

const workOptions = [
  { id: 'it', label: 'IT', color: '#e98b8b' },
  { id: 'construction', label: '간호', color: '#ffffff' },
  { id: 'consulting', label: '방송송', color: '#ffffff' },
];

const SelectWorkPage = () => {
  const [selectedWork, setSelectedWork] = useState('it');

  const handleWorkSelect = (workId: string) => {
    setSelectedWork(workId);
  };

  const handleNext = () => {
    console.log('선택된 직업:', selectedWork);
    // TODO: 다음 페이지로 이동 로직 구현
  };

  return (
    <Wrapper>
      <ContentSection>
        <Title>하루면접이 처음이신가요?</Title>
        <Subtitle>
          당신의 직군을 선택하고,
          <br />
          질문을 받아보세요!
        </Subtitle>

        <OptionsCard>
          {workOptions.map((option) => (
            <OptionButton
              key={option.id}
              type="button"
              $isSelected={selectedWork === option.id}
              $color={option.color}
              onClick={() => handleWorkSelect(option.id)}
            >
              {option.label}
            </OptionButton>
          ))}
        </OptionsCard>
      </ContentSection>

      <NextButton type="button" onClick={handleNext}>
        다음
      </NextButton>
    </Wrapper>
  );
};

export default SelectWorkPage;

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f5dc 0%, #f4c2c2 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px 20px 40px;
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0 0 60px 0;
  line-height: 1.6;
`;

const OptionsCard = styled.div`
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 32px 24px;
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const OptionButton = styled.button<{ $isSelected: boolean; $color: string }>`
  width: 100%;
  padding: 16px 20px;
  border-radius: 25px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ $isSelected, $color }) => ($isSelected ? '#e98b8b' : $color)};
  color: ${({ $isSelected }) => ($isSelected ? 'white' : '#333')};
  box-shadow: ${({ $isSelected }) =>
    $isSelected ? '0 4px 12px rgba(233, 139, 139, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ $isSelected }) =>
      $isSelected ? '0 6px 16px rgba(233, 139, 139, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.15)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const NextButton = styled.button`
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  padding: 16px 24px;
  background-color: #333333;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #444444;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: #222222;
    transform: translateY(0);
  }
`;
