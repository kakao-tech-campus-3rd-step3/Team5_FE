import styled from '@emotion/styled';

import SharedButton from '../../../shared/ui/SharedButton';

export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;

  @media (max-width: 768px) {
    gap: 32px;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
  }
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: ${({ theme }) => theme.space.space24};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSizes.h3};
    margin-bottom: ${({ theme }) => theme.space.space16};
  }
`;

export const QuestionText = styled.h1`
  padding: ${({ theme }) => theme.space.space40} ${({ theme }) => theme.space.space32};
  font-size: ${({ theme }) => theme.typography.fontSizes.h1};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.space24} 0;
    font-size: ${({ theme }) => theme.typography.fontSizes.h2};
  }
`;

export const CardParagraph = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: 1.5em;
  }

  overflow-wrap: break-word;
  word-wrap: break-word;
  //띄어쓰기 기준으로 줄바꿈
  white-space: normal;
  //강제 줄바꿈
  word-break: break-all;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSizes.small};
    line-height: 1.7;
  }
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.h3};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.space20};
  text-align: center;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSizes.body};
    margin-bottom: ${({ theme }) => theme.space.space12};
  }
`;

export const CardList = styled.ul`
  list-style-position: outside;
  padding-left: ${({ theme }) => theme.space.space20};
  //text-align: left;

  @media (max-width: 768px) {
    padding-left: ${({ theme }) => theme.space.space16};
  }
`;

export const CardListItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.8;
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space.space16};
  }

  white-space: normal;
  overflow-wrap: break-word;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSizes.small};
    line-height: 1.7;
    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.space.space12};
    }
  }
`;

export const MemoTextArea = styled.textarea`
  width: 90%;
  min-height: 120px;
  padding: ${({ theme }) => theme.space.space16};
  border-radius: ${({ theme }) => theme.radius.radius8};
  font-size: ${({ theme }) => theme.typography.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
  }

  @media (max-width: 768px) {
    width: 100%; /* ◀ 카드 안쪽 꽉 채우기 */
    box-sizing: border-box;
    font-size: ${({ theme }) => theme.typography.fontSizes.small};
    min-height: 100px;
  }
`;

export const FilterWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.space8};

  width: auto;
  height: auto;
  padding: ${({ theme }) => theme.space.space8} ${({ theme }) => theme.space.space12};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};

  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: ${({ theme }) => theme.blurs.blur4};
  border-radius: ${({ theme }) => theme.radius.radius24};
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
`;

export const InfoWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.space16};
  align-items: center;
  justify-content: center;
`;

export const MemoSaveButton = styled(SharedButton)`
  width: 90%;
  margin-top: ${({ theme }) => theme.space.space16};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MemoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 90%; /* ◀ Card의 높이를 꽉 채움 */

  padding: ${({ theme }) => theme.space.space24};
  box-sizing: border-box;
`;

export const AIFeedbackWrapper = styled.div`
  display: flex;
  flex-direction: column; /* ◀ 1. "좋은 점" 그룹과 "개선할 점" 그룹을 세로로 쌓음 */
  width: 100%;
  padding: ${({ theme }) => theme.space.space24};
  box-sizing: border-box;

  gap: ${({ theme }) => theme.space.space24};
`;

export const LottieWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 170px;
  height: auto;
  pointer-events: none;
`;

export const QButton = styled(SharedButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  width: 160px;
  height: 40px;

  font-weight: 700;
  font-size: 18px;

  color: rgb(0, 0, 0);
  cursor: pointer;
  transition: all 0.2s ease;

  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 142, 142, 0.4);
  border-radius: 8px;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(255, 142, 142, 0.3);
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
