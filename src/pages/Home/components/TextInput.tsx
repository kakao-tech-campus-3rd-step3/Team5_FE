import type { ChangeEvent } from 'react';

import styled from '@emotion/styled';

interface TextInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextInput = ({ value, onChange }: TextInputProps) => {
  return (
    <Wrapper>
      <Textarea
        placeholder="이곳에 답변을 입력하세요..."
        value={value}
        onChange={onChange}
      ></Textarea>
    </Wrapper>
  );
};

export default TextInput;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Textarea = styled.textarea`
  width: 100%; /* 부모 요소의 너비에 맞춤 */
  min-height: 150px; /* 최소 높이 지정 */
  padding: 12px 15px; /* 내부 여백으로 텍스트와 테두리 사이에 공간 확보 */
  border: 1px solid #ccc; /* 은은한 회색 테두리 */
  border-radius: 8px; /* 부드러운 모서리 */
  font-family: 'Pretendard', sans-serif; /* 가독성 좋은 폰트 */
  font-size: 16px;
  line-height: 1.6; /* 줄 간격 조절 */
  color: #333; /* 기본 텍스트 색상 */

  /* 사용자가 크기를 조절할 때 세로로만 가능하게 하여 레이아웃 깨짐 방지 */
  resize: vertical;

  /* 부드러운 전환 효과 */
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
`;
