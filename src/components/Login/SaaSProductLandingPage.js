import React from 'react';
import AnimationRevealPage from './helpers/AnimationRevealPage.js';
import tw from 'twin.macro';
import drone from './drone.png';
import Header from './light.js';
import googleIconImageSrc from './google-icon.png';
import styled from 'styled-components';
const TwoColumn = tw.div`flex flex-col lg:flex-row  max-w-screen-xl mx-auto pt-10 md:pt-16`;
const LeftColumn = tw.div`relative lg:w-5/12 text-center max-w-lg mx-auto lg:max-w-none lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex-1 flex flex-col justify-center lg:self-end`;
const Heading = tw.h1`font-bold text-3xl md:text-3xl lg:text-4xl xl:text-4xl text-gray-900 leading-tight`;
const Paragraph = tw.p`my-5 lg:my-8 text-base xl:text-lg`;
const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

export default ({handleGoogleSignIn}) => {
  return (
    <AnimationRevealPage>
      <Header />
      <TwoColumn>
        <LeftColumn>
          {/* <span tw="text-primary-500">for you.</span> */}
          <Heading>The Fast and Convenient Drone Delivery</Heading>
          <Paragraph>
            AeroDeliver is a revolutionary new delivery service that utilizes
            drone technology to provide fast and convenient delivery services.
            With AeroDeliver, users can easily schedule and track deliveries
            right from their smartphone.
          </Paragraph>
      
          <SocialButtonsContainer>
            <SocialButton  onClick={handleGoogleSignIn}>
              <span className="iconContainer">
                <img src={googleIconImageSrc} className="icon" alt="" />
              </span>
              <span className="text">{'Sign In With Google'}</span>
            </SocialButton>
          </SocialButtonsContainer>
      
        </LeftColumn>
        <RightColumn>
          <div style={{ transform: 'translate(30px,-70px)' }}>
            <img src={drone} alt="Design Illustration" />
          </div>
        </RightColumn>
      </TwoColumn>
    </AnimationRevealPage>
  );
};
