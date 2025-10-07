import styled from '@emotion/styled';
import { useState } from 'react';

interface JobDetailSelectionPageProps {
  selectedJob: string;
  onNext: (selectedDetail: string) => void;
}

const JobDetailSelectionPage = ({ selectedJob, onNext }: JobDetailSelectionPageProps) => {
  const [selectedDetail, setSelectedDetail] = useState('프론트엔드');

  // 직군별 세부 직무 목록
  const jobDetails = {
    IT: [
      { id: 'FRONTEND', label: '프론트엔드' },
      { id: 'BACKEND', label: '백엔드' },
      { id: 'ANDROID', label: '안드로이드' },
      { id: 'IOS', label: 'iOS' },
      { id: 'AI', label: 'AI' }
    ],
    NURSING: [
      { id: 'GENERAL', label: '일반간호' },
      { id: 'ICU', label: '중환자실' },
      { id: 'EMERGENCY', label: '응급실' },
      { id: 'SURGERY', label: '수술실' },
      { id: 'PEDIATRIC', label: '소아과' }
    ],
    BROADCASTING: [
      { id: 'PRODUCER', label: '프로듀서' },
      { id: 'PD', label: 'PD' },
      { id: 'WRITER', label: '작가' },
      { id: 'REPORTER', label: '기자' },
      { id: 'ANCHOR', label: '앵커' }
    ]
  };

  const currentJobDetails = jobDetails[selectedJob as keyof typeof jobDetails] || jobDetails.IT;

  const handleDetailSelect = (detailId: string) => {
    const selectedItem = currentJobDetails.find(item => item.id === detailId);
    if (selectedItem) {
      setSelectedDetail(selectedItem.label);
    }
  };

  const handleNext = () => {
    onNext(selectedDetail);
  };

  const getJobTitle = (job: string) => {
    const jobTitles = {
      IT: 'IT 직군을 선택하셨군요?',
      NURSING: '간호 직군을 선택하셨군요?',
      BROADCASTING: '방송 직군을 선택하셨군요?'
    };
    return jobTitles[job as keyof typeof jobTitles] || '직군을 선택하셨군요?';
  };

  return (
    <Wrapper>
      <HeaderSection>
        <MainTitle>{getJobTitle(selectedJob)}</MainTitle>
        <SubTitle>상세 직군을 선택하면 개인화된 질문을 받아볼 수 있어요!</SubTitle>
      </HeaderSection>

      <Card>
        <JobDetailList>
          {currentJobDetails.map((detail) => (
            <JobDetailButton
              key={detail.id}
              onClick={() => handleDetailSelect(detail.id)}
              isSelected={selectedDetail === detail.label}
            >
              {detail.label}
            </JobDetailButton>
          ))}
        </JobDetailList>
      </Card>

      <NextButton onClick={handleNext}>
        다음
      </NextButton>
    </Wrapper>
  );
};

export default JobDetailSelectionPage;

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

const JobDetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const JobDetailButton = styled.button<{ isSelected: boolean }>`
  width: 100%;
  padding: 16px 24px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${props => props.isSelected ? '#e98b8b' : '#ffffff'};
  color: ${props => props.isSelected ? '#ffffff' : '#333333'};
  border: ${props => props.isSelected ? 'none' : '1px solid #e0e0e0'};

  &:hover {
    background-color: ${props => props.isSelected ? '#d77a7a' : '#f8f8f8'};
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
