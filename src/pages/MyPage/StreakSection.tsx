import styled from '@emotion/styled';
import Lottie from 'lottie-react';
import CalendarHeatmap from 'react-calendar-heatmap';

import LoadingAnimation from '../../assets/lottie/loading.json';

import 'react-calendar-heatmap/dist/styles.css'; // 기본 스타일 import
<<<<<<< HEAD
=======
// eslint-disable-next-line import/order
import Lottie from 'lottie-react';
>>>>>>> 99aa9b2408044292a27669b6b426dfbdfd629d23

export interface DailySolveCount {
  date: string;
  count: number;
}

export interface UserSummary {
  name: string;
  streak: number;
  totalAnswerCount: number;
  dailySolveCounts: DailySolveCount[];
  isMe: boolean;
}

interface StreakSectionProps {
  data?: UserSummary;
}

const getStartDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  return date;
};

const StreakSection = ({ data }: StreakSectionProps) => {
  const today = new Date();
  const startDate = getStartDate();

  if (!data) {
    return (
      <LottieWrapper>
        <Lottie animationData={LoadingAnimation} loop autoplay />
      </LottieWrapper>
    );
  }

  return (
    <SectionWrapper>
      <UserInfo>
        <div></div>
      </UserInfo>
      <HeatmapWrapper>
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={data.dailySolveCounts}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }

            const count = Math.min(value.count, 4);
            return `color-scale-${count}`;
          }}
          titleForValue={(value) => (value ? `${value.date}: ${value.count}개` : '답변 없음')}
        />
      </HeatmapWrapper>
    </SectionWrapper>
  );
};

export default StreakSection;

const SectionWrapper = styled.section`
  padding: 20px;
  font-family: ${({ theme }) => theme.typography.fontFamily};
`;

const UserInfo = styled.div`
  margin-bottom: 24px;
  div {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
`;

const LottieWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  pointer-events: none;
`;

// 히트맵(잔디) 스타일링
const HeatmapWrapper = styled.div`
  width: 300px;

  .react-calendar-heatmap .color-empty {
    fill: #ebedf0; // 비어있는 칸
  }

  .react-calendar-heatmap .color-scale-0 {
    fill: #ebedf0; // 0개 (데이터는 있으나 0)
  }

  .react-calendar-heatmap .color-scale-1 {
    fill: #9be9a8; // 1개
  }

  .react-calendar-heatmap .color-scale-2 {
    fill: #40c463; // 2개
  }

  .react-calendar-heatmap .color-scale-3 {
    fill: #30a14e; // 3개
  }

  .react-calendar-heatmap .color-scale-4 {
    fill: #216e39; // 4개 이상
  }
`;
