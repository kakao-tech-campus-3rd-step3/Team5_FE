import { Mic } from 'lucide-react';

const RecordAnswer = () => {
  return (
    <div>
      <h2>음성 녹음 중...</h2>
      <Mic size={40} />
      <p>마이크에 답변을 말씀해주세요.</p>
    </div>
  );
};

export default RecordAnswer;
