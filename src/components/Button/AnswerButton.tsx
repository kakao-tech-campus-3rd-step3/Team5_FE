import styled from '@emotion/styled';

interface AnswerButtonProps {
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  onClick: () => void;
  disabled: boolean;
}

const AnswerButton = ({ children, type, onClick, disabled }: AnswerButtonProps) => {
  return (
    <Wrapper type={type} onClick={onClick} disabled={disabled}>
      {children}
    </Wrapper>
  );
};

export default AnswerButton;

const Wrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  background: #333333;
  border-radius: 8px;

  width: 160px;
  height: 40px;

  font-weight: 700;
  font-size: 18px;

  color: #ffffff;
`;
