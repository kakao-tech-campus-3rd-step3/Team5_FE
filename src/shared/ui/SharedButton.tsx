import styled from '@emotion/styled';

interface AnswerButtonProps {
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  onClick: () => void;
  disabled: boolean;
}

const SharedButton = ({ children, type, onClick, disabled }: AnswerButtonProps) => {
  return (
    <Wrapper type={type} onClick={onClick} disabled={disabled}>
      {children}
    </Wrapper>
  );
};

export default SharedButton;

const Wrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  background: ${({ theme }) => theme.colors.pointCoral || '#FF8E8E'};
  border-radius: 8px;
  border: none;

  width: 160px;
  height: 40px;

  font-weight: 700;
  font-size: 18px;

  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.pointCoral || '#FF8E8E'};
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 142, 142, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(255, 142, 142, 0.3);
  }

  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition:
      width 0.6s,
      height 0.6s;
  }

  &:active:not(:disabled)::before {
    width: 300px;
    height: 300px;
  }

  &:disabled {
    background: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
  }
`;
