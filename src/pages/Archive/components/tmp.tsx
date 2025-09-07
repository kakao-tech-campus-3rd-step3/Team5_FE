// import styled from '@emotion/styled';
// import { useRef, useState } from 'react';
// import useCanvas from './hooks/useCanvas';
// import { questionDatas } from './datas/questionDatas';
// import { pinnedDatas } from './datas/pinnedDatas';

// const ArchivePage = () => {
//   const { pinnedWrapperRef, pinnedRefs } = useCanvas();

//   const sectionFirstRef = useRef<HTMLElement>(null);
//   const sectionSecondRef = useRef<HTMLElement>(null);
//   const [isFirstSection, setIsFirstSection] = useState(true);

//   const handleClick = () => {
//     if (isFirstSection) {
//       sectionSecondRef.current?.scrollIntoView({ behavior: 'smooth' });
//     } else {
//       sectionFirstRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }
//     setIsFirstSection(!isFirstSection);
//   };

//   return (
//     <Wrapper>
//       <SectionSecond ref={sectionSecondRef}>
//         <GlassBackground>
//           <ListItemWrapper>
//             <ol>
//               {questionDatas.map((data, index) => (
//                 <ListItem key={data.id}>
//                   {index + 1}. {data.question}
//                 </ListItem>
//               ))}
//             </ol>
//           </ListItemWrapper>
//         </GlassBackground>
//       </SectionSecond>
//     </Wrapper>
//   );
// };

// export default ArchivePage;

// const PinnedItem = styled.div`
//   position: absolute;
//   width: 100px;
//   height: 200px;
//   background: rgba(255, 99, 71, 1);
//   border-radius: 12px;
// `;

// const Button = styled.button`
//   font-size: 1.1rem;
//   font-weight: 700;

//   position: absolute;
//   left: 50%;
//   bottom: 5%;
//   transform: translate(-50%, -50%);
// `;

// const Wrapper = styled.div`
//   overflow: hidden;
//   height: 100vh;
// `;

// const SectionFirst = styled.section`
//   position: relative;
//   overflow: hidden;
//   height: 100vh;
//   scroll-snap-align: start;

//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;

//   background: linear-gradient(
//     180deg,
//     rgba(247, 151, 30, 0.3) 14.9%,
//     rgba(239, 108, 87, 0.4) 52.4%,
//     rgba(255, 200, 44, 0.3) 100%
//   );
// `;

// const SectionSecond = styled.section`
//   height: 100vh;
//   scroll-snap-align: start;

//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   background-color: #ff6d6d;
// `;

// const DescriptionWrapper = styled.div`
//   height: 50vh;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

// const PinnedWrapper = styled.div`
//   position: absolute;
// `;

// const Title = styled.h1`
//   font-size: 3rem;
//   font-weight: 700;
//   margin-bottom: 2rem;
// `;

// const SubTitle = styled.h2`
//   font-size: 1.2rem;
//   font-weight: 700;
// `;

// const ListItem = styled.li`
//   font-size: 1.2rem;
//   font-weight: 700;
//   padding-bottom: 10px;
// `;

// const Pinned = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;

//   height: 28px;
//   padding: 0 22px;
//   background: rgba(255, 255, 255, 0.4);
//   border-radius: 1000px;
// `;

// const GlassBackground = styled.div`
//   background-color: rgba(255, 255, 255, 0.08);
//   backdrop-filter: blur(24px);
//   border-radius: 1.5rem;
//   border: 1px solid rgba(255, 255, 255, 0.2);
//   box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);

//   width: 50%;
//   height: 70%;

//   display: flex;
// `;

// const ListItemWrapper = styled.div`
//   max-width: 80%;
//   margin: auto;
// `;
