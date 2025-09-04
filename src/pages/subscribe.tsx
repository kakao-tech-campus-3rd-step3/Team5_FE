import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #F5F5DC 0%, #F0E68C 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
  margin-top: 40px;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin: 0;
`;

const SubscribePage: React.FC = () => {
  return (
    <Container>
      <HeaderSection>
        <MainTitle>
          더 많은 질문을 원하시나요?<br />
          구독 후 자유롭게 이용하세요.
        </MainTitle>
      </HeaderSection>
    </Container>
  );
};

export default SubscribePage;
