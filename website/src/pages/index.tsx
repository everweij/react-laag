import React from "react";
import styled from "styled-components";
import SEO from "../components/seo";
import Logo from "../components/Logo";
import InstallBox from "../components/InstallBox";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import Features from "../components/Features";
import Playground from "../components/Playground";
import useMedia from "../useMedia";

import { colors, media } from "../theme";

const Landing = styled.main`
  width: 100vw;
  max-width: 1680px;
  margin: 0 auto;
  min-height: 100vh;

  background: radial-gradient(
    ${colors["gradient-light"]} 0%,
    ${colors["gradient-dark"]} 70%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: min(200vh, 1600px) min(200vh, 1600px);
  background-repeat: no-repeat;
  background-position: center 10%;

  @media ${media.huge} {
    min-height: initial;
    height: calc(100vh - 50px);
    height: calc(max(100vh, 900px) - 50px);
  }
`;

const IntroContent = styled.div`
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-top: 50px;
  margin-bottom: 0px;

  @media ${media.tablet} {
    margin-top: 100px;
    margin-bottom: 100px;
  }

  @media ${media.desktop} {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  > svg {
    width: 42px;

    @media ${media.tablet} {
      width: 56px;
    }
  }
`;

const Title = styled.h1`
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-size: 32px;
  margin-bottom: 0px;

  @media ${media.tablet} {
    font-size: 48px;
  }
`;

const Tagline = styled.div`
  font-size: 18px;
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  text-align: center;

  @media ${media.tablet} {
    font-size: 22px;
    margin-bottom: 56px;
  }
`;

const Buttons = styled.div`
  margin-top: 48px;
  display: flex;
  align-items: center;
  > *:not(:last-child) {
    margin-right: 24px;
  }
`;

const PlaygroundBanner = styled.div`
  padding: 32px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors["bg-dark"]};

  h2 {
    margin-top: 0;
    margin-bottom: 8px;
  }

  p {
    margin: 0;
  }
`;

const IndexPage = () => {
  const hidePlayground = useMedia(1348);
  const hideInstallBox = useMedia(480);

  return (
    <>
      <SEO title="Home" />
      <Landing>
        <IntroContent>
          <Logo style={{ transform: "rotate(27deg)" }} />
          <Title>react-use-layer</Title>
          <Tagline>Hook for positioning tooltips & popovers</Tagline>
          {!hideInstallBox && (
            <InstallBox>npm install -S react-use-layer</InstallBox>
          )}
          <Buttons>
            <PrimaryButton>Examples</PrimaryButton>
            <SecondaryButton>Documentation</SecondaryButton>
          </Buttons>
          <Features />
        </IntroContent>
      </Landing>
      {!hidePlayground && (
        <>
          <PlaygroundBanner>
            <h2>Playground</h2>
            <p>Try it out and see how it works!</p>
          </PlaygroundBanner>
          <Playground />
        </>
      )}
    </>
  );
};

export default IndexPage;
