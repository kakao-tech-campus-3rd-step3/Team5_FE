// import styled from '@emotion/styled';
// import { useParams } from 'react-router-dom';

// const FeedbackDetailPage = () => {
//   const params = useParams();
//   console.log(params);
//   return (
//     <Wrapper>
//       <SectionContainer>
//         <Title>오늘의 질문</Title>
//         <QuestionCard>
//           <QuestionText>ds</QuestionText>
//         </QuestionCard>
//       </SectionContainer>

//       <SectionContainer>
//         <Title>나의 답변</Title>
//         {/* <CardWrapper>
//           {answerData.content.map((paragraph, index) => (
//             <CardParagraph key={index}>{paragraph}</CardParagraph>
//           ))}
//         </CardWrapper> */}
//       </SectionContainer>

//       <SectionContainer>
//         <Title>AI 피드백</Title>

//         <CardWrapper>
//           <CardTitle></CardTitle>
//           <CardList>
//             <TopicGroup>
//               <TopicTitle></TopicTitle>
//               <CardList></CardList>
//             </TopicGroup>
//           </CardList>
//         </CardWrapper>
//       </SectionContainer>
//       <SectionContainer>
//         <CardWrapper>
//           <CardTitle></CardTitle>
//           <CardList>
//             <TopicGroup>
//               <TopicTitle></TopicTitle>
//               <CardList></CardList>
//             </TopicGroup>
//           </CardList>
//         </CardWrapper>
//       </SectionContainer>

//       <SectionContainer>
//         <Title>메모</Title>
//         <CardWrapper>
//           {/* <MemoTextArea
//             value={memoContent}
//             onChange={(e) => setMemoContent(e.target.value)}
//             placeholder="메모를 작성해주세요."
//           /> */}
//         </CardWrapper>
//       </SectionContainer>

//       {/* <SharedButton type="button" onClick={handleArchiveClick} disabled={false}>
//         아카이브로 이동
//       </SharedButton> */}
//     </Wrapper>
//   );
// };

// const SectionContainer = styled.section`
//   padding: 40px 20px;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: 100%;
// `;

// const Wrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 60px;
// `;

// const Title = styled.h2`
//   font-size: 1.25rem;
//   font-weight: 700;
//   color: rgb(0, 0, 0);
//   margin-bottom: 24px;
// `;

// const QuestionCard = styled.div`
//   background-color: rgba(255, 255, 255, 0.6);
//   border-radius: 16px;
//   padding: 25px 30px;
//   max-width: 600px;
//   width: 100%;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
//   text-align: center;
// `;

// const QuestionText = styled.p`
//   font-size: 1rem;
//   color: #454545;
// `;

// const CardWrapper = styled.div`
//   background-color: rgba(255, 255, 255, 0.6);
//   border-radius: 24px;
//   padding: 32px;
//   max-width: 600px;
//   width: 100%;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
// `;

// const CardParagraph = styled.p`
//   font-size: 1rem;
//   color: #595959;
//   line-height: 1.8;
//   &:not(:last-child) {
//     margin-bottom: 1.5em;
//   }
// `;

// const CardTitle = styled.h3`
//   font-size: 1.125rem;
//   font-weight: 700;
//   color: #333;
//   margin-bottom: 20px;
//   text-align: center;
// `;

// const CardList = styled.ul`
//   list-style-position: inside;
//   padding-left: 8px;
// `;

// const CardListItem = styled.li`
//   font-size: 1rem;
//   color: #595959;
//   line-height: 1.8;
//   &:not(:last-child) {
//     margin-bottom: 1em;
//   }
// `;

// const TopicGroup = styled.div`
//   &:not(:last-child) {
//     margin-bottom: 24px;
//   }
// `;

// const TopicTitle = styled.h4`
//   font-weight: 600;
//   font-size: 1rem;
//   color: #333;
//   margin-bottom: 8px;
// `;

// const MemoTextArea = styled.textarea`
//   width: 100%;
//   min-height: 120px;
//   padding: 16px;
//   border-radius: 8px;
//   font-size: 1rem;
//   color: #595959;
//   background-color: rgba(255, 255, 255, 0.6);

//   &:focus {
//     outline: none;
//     border-color: #333;
//   }
// `;

// export default FeedbackDetailPage;
