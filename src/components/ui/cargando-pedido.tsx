import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="main">
        <div className="dog">
          <div className="dog__paws">
            <div className="dog__bl-leg leg">
              <div className="dog__bl-paw paw" />
              <div className="dog__bl-top top" />
            </div>
            <div className="dog__fl-leg leg">
              <div className="dog__fl-paw paw" />
              <div className="dog__fl-top top" />
            </div>
            <div className="dog__fr-leg leg">
              <div className="dog__fr-paw paw" />
              <div className="dog__fr-top top" />
            </div>
          </div>
          <div className="dog__body">
            <div className="dog__tail" />
          </div>
          <div className="dog__head">
            <div className="dog__snout">
              <div className="dog__eyes">
                <div className="dog__eye-l" />
                <div className="dog__eye-r" />
              </div>
            </div>
          </div>
          <div className="dog__head-c">
            <div className="dog__ear-r" />
            <div className="dog__ear-l" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .main {
    position: relative;
    width: 23.5em;
    height: 23.5em;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .leg {
    position: absolute;
    bottom: 0;
    width: 2em;
    height: 2.125em;
  }

  .paw {
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 1.95em;
    height: 1.8em;
    overflow: hidden;
  }

  .paw::before {
    content: "";
    position: absolute;
    width: 5em;
    height: 3em;
    border-radius: 50%;
  }

  .top {
    position: absolute;
    bottom: 0;
    left: 0.75em;
    height: 4.5em;
    width: 2.625em;
    border-top-left-radius: 1.425em;
    border-top-right-radius: 1.425em;
    transform-origin: bottom right;
    transform: rotateZ(90deg) translateX(-0.1em) translateY(1.5em);
    z-index: -1;
    background-image: linear-gradient(70deg, transparent 20%, #deac80 20%);
  }

  .dog {
    position: relative;
    width: 20em;
    height: 8em;
    margin-right: 2em;
  }

  .dog::before {
    content: "";
    position: absolute;
    bottom: -0.75em;
    right: -0.15em;
    width: 100%;
    height: 1.5em;
    background-color: #b5c18e;
    border-radius: 50%;
    z-index: -1000;
    animation: shadow 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
  }

  .dog__head {
    position: absolute;
    left: 4.5em;
    bottom: 0;
    width: 8em;
    height: 5em;
    border-top-left-radius: 4.05em;
    border-top-right-radius: 4.05em;
    border-bottom-right-radius: 3.3em;
    border-bottom-left-radius: 3.3em;
    background-color: #deac80;
    animation: head 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
  }

  .dog__head-c {
    position: absolute;
    left: 1.5em;
    bottom: 0;
    width: 9.75em;
    height: 8.25em;
    animation: head 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
    z-index: -1;
  }

  .dog__snout {
    position: absolute;
    left: -1.5em;
    bottom: 0;
    width: 7.5em;
    height: 3.75em;
    border-top-right-radius: 3em;
    border-bottom-right-radius: 3em;
    border-bottom-left-radius: 4.5em;
    background-color: #f7dcb9;
    animation: snout 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
  }

  .dog__snout::before {
    content: "";
    position: absolute;
    left: -0.1125em;
    top: -0.15em;
    width: 1.875em;
    height: 1.125em;
    border-top-right-radius: 3em;
    border-bottom-right-radius: 3em;
    border-bottom-left-radius: 4.5em;
    background-color: #6c4e31;
    animation: snout-b 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
  }

  .dog__nose {
    position: absolute;
    top: -1.95em;
    left: 40%;
    width: 0.75em;
    height: 2.4em;
    border-radius: 0.525em;
    transform-origin: bottom;
    transform: rotateZ(10deg);
    background-color: #d7dbd2;
  }

  .dog__eye-l,
  .dog__eye-r {
    position: absolute;
    top: -0.9em;
    width: 0.675em;
    height: 0.375em;
    border-radius: 50%;
    background-color: #1c3130;
    animation: eye 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
  }

  .dog__eye-l {
    left: 27%;
  }

  .dog__eye-r {
    left: 65%;
  }

  .dog__ear-l,
  .dog__ear-r {
    position: absolute;
    width: 5em;
    height: 3.3em;
    border-top-left-radius: 3.3em;
    border-top-right-radius: 3em;
    border-bottom-right-radius: 5em;
    border-bottom-left-radius: 5em;
    background-color: #deac80;
  }

  .dog__ear-l {
    top: 1.5em;
    left: 10em;
    transform-origin: bottom left;
    transform: rotateZ(-50deg);
    z-index: -1;
    animation: ear-l 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
  }

  .dog__ear-r {
    top: 1.5em;
    right: 3em;
    transform-origin: bottom right;
    transform: rotateZ(25deg);
    z-index: -2;
    animation: ear-r 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
  }

  .dog__body {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: absolute;
    bottom: 0.3em;
    left: 6em;
    width: 18em;
    height: 4em;
    border-top-left-radius: 3em;
    border-top-right-radius: 6em;
    border-bottom-right-radius: 1.5em;
    border-bottom-left-radius: 6em;
    background-color: #914f1e;
    z-index: -2;
    animation: body 10s cubic-bezier(0.3, 0.41, 0.18, 1.01) infinite;
  }

  .dog__tail {
    position: absolute;
    top: 20px;
    right: -1.5em;
    height: 3em;
    width: 4em;
    background-color: #914f1e;
    border-radius: 1.5em;
  }

  .dog__paws {
    position: absolute;
    bottom: 0;
    left: 7.5em;
    width: 10em;
    height: 3em;
  }

  .dog__bl-leg {
    left: -3em;
    z-index: -10;
  }

  .dog__bl-paw::before {
    background-color: #fffbe6;
  }

  .dog__bl-top {
    background-image: linear-gradient(80deg, transparent 20%, #deac80 20%);
  }

  .dog__fl-leg {
    z-index: 10;
    left: 0;
  }

  .dog__fl-paw::before {
    background-color: #fffbe6;
  }

  .dog__fr-leg {
    right: 0;
  }

  .dog__fr-paw::before {
    background-color: #fffbe6;
  }

  /*==============================*/

  @keyframes head {
    0%,
    10%,
    20%,
    26%,
    28%,
    90%,
    100% {
      height: 8.25em;
      bottom: 0;
      transform-origin: bottom right;
      transform: rotateZ(0);
    }
    5%,
    15%,
    22%,
    24%,
    30% {
      height: 8.1em;
    }
    32%,
    50% {
      height: 8.25em;
    }
    55%,
    60% {
      bottom: 0.75em;
      transform-origin: bottom right;
      transform: rotateZ(0);
    }
    70%,
    80% {
      bottom: 0.75em;
      transform-origin: bottom right;
      transform: rotateZ(10deg);
    }
  }

  @keyframes body {
    0%,
    10%,
    20%,
    26%,
    28%,
    32%,
    100% {
      height: 7.2em;
    }
    5%,
    15%,
    22%,
    24%,
    30% {
      height: 7.05em;
    }
  }

  @keyframes ear-l {
    0%,
    10%,
    20%,
    26%,
    28%,
    82%,
    100% {
      transform: rotateZ(-50deg);
    }
    5%,
    15%,
    22%,
    24% {
      transform: rotateZ(-48deg);
    }
    30%,
    31% {
      transform: rotateZ(-30deg);
    }
    32%,
    80% {
      transform: rotateZ(-60deg);
    }
  }

  @keyframes ear-r {
    0%,
    10%,
    20%,
    26%,
    28% {
      transform: rotateZ(20deg);
    }
    5%,
    15%,
    22%,
    24% {
      transform: rotateZ(18deg);
    }
    30%,
    31% {
      transform: rotateZ(10deg);
    }
    32% {
      transform: rotateZ(25deg);
    }
  }

  @keyframes snout {
    0%,
    10%,
    20%,
    26%,
    28%,
    82%,
    100% {
      height: 3.75em;
    }
    5%,
    15%,
    22%,
    24% {
      height: 3.45em;
    }
  }

  @keyframes snout-b {
    0%,
    10%,
    20%,
    26%,
    28%,
    98%,
    100% {
      width: 1.875em;
    }
    5%,
    15%,
    22%,
    24% {
      width: 1.8em;
    }
    34%,
    98% {
      width: 1.275em;
    }
  }

  @keyframes shadow {
    0%,
    10%,
    20%,
    26%,
    28%,
    30%,
    84%,
    100% {
      width: 99%;
    }
    5%,
    15%,
    22%,
    24% {
      width: 101%;
    }
    34%,
    81% {
      width: 96%;
    }
  }

  @keyframes eye {
    0%,
    30% {
      width: 0.675em;
      height: 0.3em;
    }
    32%,
    59%,
    90%,
    100% {
      width: 0.525em;
      height: 0.525em;
      transform: translateY(0);
    }
    60%,
    75% {
      transform: translateY(-0.3em);
    }
    80%,
    85% {
      transform: translateY(0.15em);
    }
  }`;

export default Loader;
