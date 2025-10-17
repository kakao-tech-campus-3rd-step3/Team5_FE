import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';

interface BenefitsCardProps {
  title: string;
  benefits: string[];
}

const BenefitsCard = (props: BenefitsCardProps) => {
  const { title, benefits } = props;

  return (
    <Card>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <BenefitsList>
          {benefits.map((benefit, index) => (
            <BenefitItem key={index}>{benefit}</BenefitItem>
          ))}
        </BenefitsList>
      </CardContent>
    </Card>
  );
};

export default BenefitsCard;

const Card = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border: 3px solid ${theme.colors.white};
  border-radius: ${theme.radius.radius24};
  padding: ${theme.space.space32};
  width: 100%;
  max-width: 320px;
  margin-bottom: ${theme.space.space32};
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(255, 255, 255, 0.2);
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
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(255, 255, 255, 0.3);
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
  margin: 0 0 ${theme.space.space24} 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BenefitsList = styled.ul`
  text-align: left;
  margin-bottom: ${theme.space.space24};
  padding-left: ${theme.space.space24};
  list-style: none;
`;

const BenefitItem = styled.li`
  font-size: ${theme.typography.fontSizes.body};
  color: ${theme.colors.white};
  margin-bottom: ${theme.space.space12};
  line-height: 1.6;
  position: relative;
  padding-left: ${theme.space.space24};
  opacity: 0.95;

  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: ${theme.colors.white};
    font-weight: ${theme.typography.fontWeights.bold};
  }
`;

