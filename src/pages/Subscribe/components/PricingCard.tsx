import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import { formatCurrency } from '../../../shared/utils/currency';

interface PricingCardProps {
  title: string;
  description: string;
  price: number;
  highlighted?: boolean;
}

const PricingCard = (props: PricingCardProps) => {
  const { title, description, price, highlighted = false } = props;

  return (
    <Card $highlighted={highlighted}>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardPrice>매달 ₩{formatCurrency(price)}</CardPrice>
      </CardContent>
    </Card>
  );
};

export default PricingCard;

const Card = styled.div<{ $highlighted: boolean }>`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border: ${({ $highlighted }) => ($highlighted ? `3px solid ${theme.colors.white}` : 'none')};
  border-radius: ${theme.radius.radius24};
  padding: ${theme.space.space32};
  width: 100%;
  max-width: 320px;
  margin-bottom: ${theme.space.space24};
  text-align: center;
  box-shadow: ${({ $highlighted }) => 
    $highlighted 
      ? '0 12px 32px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(255, 255, 255, 0.2)' 
      : '0 8px 24px rgba(0, 0, 0, 0.1)'
  };
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border-radius: inherit;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ $highlighted }) => 
      $highlighted 
        ? '0 16px 40px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.3)' 
        : '0 12px 32px rgba(0, 0, 0, 0.15)'
    };
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CardTitle = styled.h2`
  font-size: ${theme.typography.fontSizes.h3};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.white};
  margin: 0 0 ${theme.space.space12} 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardDescription = styled.p`
  font-size: ${theme.typography.fontSizes.body};
  color: ${theme.colors.white};
  margin: 0 0 ${theme.space.space24} 0;
  line-height: 1.5;
  opacity: 0.95;
`;

const CardPrice = styled.div`
  font-size: ${theme.typography.fontSizes.h2};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.white};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

