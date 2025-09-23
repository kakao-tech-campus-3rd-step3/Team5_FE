import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import { formatCurrency } from '../../../shared/utils/currency';

interface BenefitsCardProps {
  title: string;
  benefits: string[];
  price: number;
}

const BenefitsCard = (props: BenefitsCardProps) => {
  return (
    <Card>
      <CardTitle>{props.title}</CardTitle>
      <BenefitsList>
        {props.benefits.map((benefit, index) => (
          <BenefitItem key={index}>{benefit}</BenefitItem>
        ))}
      </BenefitsList>
      <CardPrice>매달 ₩{formatCurrency(props.price)}</CardPrice>
    </Card>
  );
};

export default BenefitsCard;

const Card = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  backdrop-filter: ${theme.blurs.blur8};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.radius.radius24};
  padding: ${theme.space.space32};
  width: 100%;
  max-width: 320px;
  margin-bottom: ${theme.space.space32};
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  }
`;

const CardTitle = styled.h2`
  font-size: ${theme.typography.fontSizes.h3};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.text};
  margin: 0 0 ${theme.space.space24} 0;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BenefitsList = styled.ul`
  text-align: left;
  margin-bottom: ${theme.space.space24};
  padding-left: ${theme.space.space24};
  list-style: none;
`;

const BenefitItem = styled.li`
  font-size: ${theme.typography.fontSizes.body};
  color: ${theme.colors.text};
  margin-bottom: ${theme.space.space12};
  line-height: 1.6;
  position: relative;
  padding-left: ${theme.space.space24};

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${theme.colors.primary};
    font-weight: ${theme.typography.fontWeights.bold};
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const CardPrice = styled.div`
  font-size: ${theme.typography.fontSizes.h2};
  font-weight: ${theme.typography.fontWeights.bold};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
