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

  background: #333333;
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
    background: #444444;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
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
