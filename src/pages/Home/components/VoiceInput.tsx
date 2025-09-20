import { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

const VoiceInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      // 마이크 접근 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      // MediaRecorder 설정
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus', // 웹에서 널리 지원되는 형식
      });
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      // 녹음 데이터 수집
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      // 녹음 완료 시 Blob 생성
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(blob);

        // 미리보기용 URL 생성
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Console에 URL 출력
        console.log('녹음된 오디오 URL:', url);
        console.log('오디오 Blob 객체:', blob);
        console.log('파일 크기:', blob.size, 'bytes');
        console.log('파일 타입:', blob.type);

        // 스트림 정리
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      // 녹음 시작
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('마이크 접근 실패:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const logAudioInfo = () => {
    if (audioUrl && audioBlob) {
      console.log('=== 오디오 정보 ===');
      console.log('URL:', audioUrl);
      console.log('Blob:', audioBlob);
      console.log('크기:', audioBlob.size, 'bytes');
      console.log('타입:', audioBlob.type);
      console.log('==================');
    }
  };

  return (
    <div>
      <h2>{isRecording ? '음성 녹음 중...' : '음성 답변'}</h2>

      {isRecording ? (
        <Square size={40} onClick={stopRecording} style={{ cursor: 'pointer', color: 'red' }} />
      ) : (
        <Mic size={40} onClick={startRecording} style={{ cursor: 'pointer' }} />
      )}

      <p>
        {isRecording
          ? '마이크에 답변을 말씀해주세요. 완료되면 정지 버튼을 누르세요.'
          : '마이크 버튼을 눌러 녹음을 시작하세요.'}
      </p>

      {/* 녹음 완료 후 미리보기 */}
      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>녹음 완료</h3>
          <audio controls src={audioUrl} />
          <br />
          <button
            type="button"
            onClick={logAudioInfo}
            style={{ marginTop: '10px', padding: '10px 20px' }}
          >
            Console에 정보 출력
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
