import React from 'react';
import styled from '@emotion/styled';
import { formatCurrency } from '../../utils/currency';

interface BenefitsCardProps {
  title: string;
  benefits: string[];
  price: number;
}

const BenefitsCard: React.FC<BenefitsCardProps> = ({ title, benefits, price }) => {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <BenefitsList>
        {benefits.map((benefit, index) => (
          <BenefitItem key={index}>{benefit}</BenefitItem>
        ))}
      </BenefitsList>
      <CardPrice>매달 ₩{formatCurrency(price)}</CardPrice>
    </Card>
  );
};

export default BenefitsCard;

const Card = styled.div`
  background-color: #e98b8b;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 24px;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
`;

const BenefitsList = styled.ul`
  text-align: left;
  margin-bottom: 16px;
  padding-left: 20px;
  list-style-type: disc;
`;

const BenefitItem = styled.li`
  font-size: 14px;
  color: white;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const CardPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;
