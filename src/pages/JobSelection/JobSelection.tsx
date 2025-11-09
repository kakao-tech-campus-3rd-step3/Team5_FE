import { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

//import { useNavigate } from 'react-router-dom';
import JobDetailSelectionPage from '../JobDetailSelection/JobDetailSelection';

// interface JobSelectionPageProps {
//   onNext: (selectedJob: string) => void;
// }

const JobSelectionPage = () => {
  const [selectedJob, setSelectedJob] = useState('');
  const [step, setStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimerRef = useRef<number | null>(null);

  const jobs = [
    { id: 'IT', label: 'IT' },
    { id: 'NURSING', label: '간호' },
    { id: 'BROADCASTING', label: '방송' },
  ];

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage('');
      toastTimerRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleJobSelect = (jobId: string) => {
    if (jobId !== 'IT') {
      showToast('해당 직군은 추후 구현 예정입니다.');
      return;
    }

    setSelectedJob(jobId);
    setStep(2);
  };

  const handleDetailNext = (selectedDetail: string) => {
    // 6. JobDetailSelectionPage가 'navigate('/home')'을 스스로 처리하므로
    //    이 부모 컴포넌트는 콘솔에 로그만 남깁니다.
    console.log('최종 선택된 직군:', selectedJob);
    console.log('최종 선택된 상세 직군:', selectedDetail);
  };

  // const handleNext = () => {
  //   onNext(selectedJob);
  //   navigate('/jobdetailselection');
  // };

  if (step === 2) {
    // 1. 직업이 선택되면,
    // 2. JobDetailSelectionPage를 렌더링하면서 필요한 props를 전달합니다.
    return <JobDetailSelectionPage selectedJob={selectedJob} onNext={handleDetailNext} />;
  }

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

      {toastMessage && <Toast>{toastMessage}</Toast>}
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

const Toast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  background: rgba(51, 51, 51, 0.9);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(6px);
  pointer-events: none;
  z-index: 1000;
`;
