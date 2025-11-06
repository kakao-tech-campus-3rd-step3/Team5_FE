import { useState, useRef } from 'react';

import styled from '@emotion/styled';
import { Mic, Square } from 'lucide-react';

import { theme } from '../../../styles/theme';

interface VoiceInputProps {
  onAudioUrlChange?: (url: string) => void;
}

const VoiceInput = ({ onAudioUrlChange }: VoiceInputProps) => {
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

        // 부모 컴포넌트에 URL 전달
        if (onAudioUrlChange) {
          onAudioUrlChange(url);
        }

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
    <Container>
      <Title>{isRecording ? '음성 녹음 중...' : '음성 답변'}</Title>

      <ButtonWrapper>
        <RecordButton
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          $isRecording={isRecording}
          disabled={false}
        >
          {isRecording ? <Square size={32} /> : <Mic size={32} />}
        </RecordButton>
        {isRecording && <PulseRing $isRecording={isRecording} />}
      </ButtonWrapper>

      <Description $isRecording={isRecording}>
        {isRecording
          ? '마이크에 답변을 말씀해주세요. 완료되면 정지 버튼을 누르세요.'
          : '마이크 버튼을 눌러 녹음을 시작하세요.'}
      </Description>

      {/* 녹음 완료 후 미리보기 */}
      {audioUrl && (
        <AudioPreview>
          <PreviewTitle>녹음 완료</PreviewTitle>
          <AudioPlayer controls src={audioUrl} />
          <InfoButton type="button" onClick={logAudioInfo}>
            Console에 정보 출력
          </InfoButton>
        </AudioPreview>
      )}
    </Container>
  );
};

export default VoiceInput;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: ${theme.colors.white};
  border-radius: ${theme.radius.radius16};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: ${theme.typography.fontSizes.h3};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.text};
  margin: 0;
  text-align: center;
`;

const ButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RecordButton = styled.button<{ $isRecording: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  background: ${(props) => (props.$isRecording ? '#ef4444' : theme.colors.primary)};
  color: ${theme.colors.white};
  box-shadow: ${(props) =>
    props.$isRecording ? '0 0 20px rgba(239, 68, 68, 0.4)' : '0 4px 16px rgba(59, 130, 246, 0.3)'};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${(props) =>
      props.$isRecording
        ? '0 0 30px rgba(239, 68, 68, 0.6)'
        : '0 6px 20px rgba(59, 130, 246, 0.4)'};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PulseRing = styled.div<{ $isRecording: boolean }>`
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ef4444;
  animation: ${(props) => (props.$isRecording ? 'pulse 1.5s ease-in-out infinite' : 'none')};

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

const Description = styled.p<{ $isRecording: boolean }>`
  font-size: ${theme.typography.fontSizes.body};
  color: ${(props) => (props.$isRecording ? '#ef4444' : '#666666')};
  text-align: center;
  margin: 0;
  line-height: 1.6;
  transition: color 0.3s ease;
`;

const AudioPreview = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${theme.colors.background};
  border-radius: ${theme.radius.radius8};
  border: 1px solid #e5e7eb;
`;

const PreviewTitle = styled.h3`
  font-size: ${theme.typography.fontSizes.h3};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.text};
  margin: 0;
  text-align: center;
`;

const AudioPlayer = styled.audio`
  width: 100%;
  outline: none;

  &::-webkit-media-controls-panel {
    background-color: ${theme.colors.white};
  }
`;

const InfoButton = styled.button`
  padding: 10px 20px;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.radius8};
  font-size: ${theme.typography.fontSizes.body};
  font-weight: ${theme.typography.fontWeights.bold};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;
