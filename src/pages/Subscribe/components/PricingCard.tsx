import React from 'react';
import styled from '@emotion/styled';
import { formatCurrency } from '../../../utils/currency';

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  highlighted?: boolean;
}

const PricingCard = (props: PricingCardProps) => {
  const { highlighted = false } = props;
  return (
    <Card $highlighted={highlighted}>
      <CardTitle>{props.title}</CardTitle>
      <CardDescription>{props.description}</CardDescription>
      <CardPrice>매달 ₩{formatCurrency(props.price)}</CardPrice>
    </Card>
  );
};

export default PricingCard;

const Card = styled.div<{ $highlighted: boolean }>`
  background-color: #e98b8b;
  border: ${({ $highlighted }) => ($highlighted ? '2px solid #6699ff' : 'none')};
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 16px;
  text-align: center;
`;

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: white;
  margin: 0 0 16px 0;
  line-height: 1.4;
`;

const CardPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: white;
`;
