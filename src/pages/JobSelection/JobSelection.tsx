import { useState } from 'react';

import styled from '@emotion/styled';

interface JobSelectionPageProps {
  onNext: (selectedJob: string) => void;
}

const JobSelectionPage = ({ onNext }: JobSelectionPageProps) => {
  const [selectedJob, setSelectedJob] = useState('IT');

  const jobs = [
    { id: 'IT', label: 'IT' },
    { id: 'NURSING', label: '간호' },
    { id: 'BROADCASTING', label: '방송' },
  ];

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
  };

  const handleNext = () => {
    onNext(selectedJob);
  };

  return (
    <Wrapper>
      <HeaderSection>
        <MainTitle>하루면접이 처음이신가요?</MainTitle>
        <SubTitle>당신의 직군을 선택하고, 질문을 받아보세요!</SubTitle>
      </HeaderSection>

      <Card>
        <JobList>
          {jobs.map((job) => (
            <JobButton
              key={job.id}
              onClick={() => handleJobSelect(job.id)}
              isSelected={selectedJob === job.id}
            >
              {job.label}
            </JobButton>
          ))}
        </JobList>
      </Card>

      <NextButton onClick={handleNext}>다음</NextButton>
    </Wrapper>
  );
};

export default JobSelectionPage;

const Wrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f5dc 0%, #f4c2c2 100%);
  padding: 40px 20px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
`;

const SubTitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

const Card = styled.div`
  background-color: #fefefe;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const JobButton = styled.button<{ isSelected: boolean }>`
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${(props) => (props.isSelected ? '#e98b8b' : '#ffffff')};
  color: ${(props) => (props.isSelected ? '#ffffff' : '#333333')};
  border: ${(props) => (props.isSelected ? 'none' : '1px solid #e0e0e0')};

  &:hover {
    background-color: ${(props) => (props.isSelected ? '#d77a7a' : '#f8f8f8')};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const NextButton = styled.button`
  background-color: #333333;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  width: 100%;
  max-width: 320px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #444444;
  }

  &:active {
    background-color: #222222;
  }
`;
