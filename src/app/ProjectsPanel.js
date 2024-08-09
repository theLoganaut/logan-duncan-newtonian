import React, { useState, useEffect } from "react";
import "./Projects.css";
import Image from "next/image";
import Link from "next/link";

const Carousel = () => {
  const [deg, setDeg] = useState(0);
  const panelSize = 300;

  const numberOfPanels = 5;
  const tz = Math.round(
    panelSize / 2 / Math.tan((Math.PI * 2) / numberOfPanels / 2)
  ); // translateZ
  const rY = 360 / numberOfPanels; // rotateY

  useEffect(() => {
    const panels = document.querySelectorAll(".pane");
    panels.forEach((panel, i) => {

      if (i !== panels.length) {
        panel.style.transform = `rotateY(${Math.round(
          rY * i
        )}deg) translateZ(${Math.round(tz)}px)`;
      }
    });
  }, [numberOfPanels, rY, tz]);

  const handleNextClick = () => {
    setDeg(deg - rY);
  };

  const handlePrevClick = () => {
    setDeg(deg + rY);
  };

  const allTexts = {
    centex: {
      about:
        "Website designed to help other business reach more customer with custom QRs and what they link to.",
      how: "Scan QRs to Lambda function URLs, log and redirect accordingly allowing analytics and insights on every scan.",
    },
    eggText: {
      about:
        "Fun site I thought of to collect fun data on how people take their eggs.",
      how: "Frontend sends API data to Lambda, Python pulls DynamoDB and incrementally analyzes before user gets results,",
    },
    forgeText: {
      about:
        "An incremental game. I could spoil more, but why not give it a try!",
      how: "Local React Game. Meant to test performance, threading, concurrency, and other modern web capabilities.",
    },
    ptmText: {
      about:
        "Taught students how social media sites are created through fullstack design and development.",
      how: "Used NextJs, AWS Cognito/IAM, AWS AppSync(GraphQL) and DynamoDB with Amplify deployment.",
    },
    irlText: {
      about:
        "Connecting people to positive experiences in real life and encouraging local meetups.",
      how: "Used NuxtJs/Wordpress, Jest, Jira, GraphQL and MongoDB.",
    },
  };

  const [CentexText, setCentexText] = useState(allTexts.centex.about);
  const [eggText, setEggText] = useState(allTexts.eggText.about);
  const [forgeText, setForgeText] = useState(allTexts.forgeText.about);
  const [ptmText, setPtmText] = useState(allTexts.ptmText.about);
  const [irlText, setIrlText] = useState(allTexts.irlText.about);

  return (
    <div className="">
      <div className="flex">
        <div
          id="carousel"
          className="mx-auto"
          style={{ transform: `rotateY(${deg}deg)` }}
        >
          <div className="pane border-2 font-mono border-gray-500 bg-black rounded-xl shadow-xl text-gray-200">
            <Image
              src="/QRlogo-WHITEONBLACK.svg"
              className="mx-auto my-4"
              width={125}
              height={125}
              alt="Picture of the author"
            />
            <div className="px-8">{CentexText}</div>
            <div className="mb-4 border-gray-200 dark:border-gray-700 flex justify-around mt-4">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                <li className="me-2">
                  <button
                    className={`${
                      CentexText === allTexts.centex.about
                        ? "text-gray-600"
                        : ""
                    } inline-block px-4 py-2 border-t-2 rounded-b-lg bg-gray-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="profile-tab"
                    onClick={() => setCentexText(allTexts.centex.about)}
                  >
                    About
                  </button>
                </li>
                <li className="me-2">
                  <button
                    className={`${
                      CentexText === allTexts.centex.how ? "text-gray-600" : ""
                    } inline-block px-4 py-2 border-t-2 rounded-b-lg bg-gray-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="dashboard-tab"
                    onMouseUp={() => setCentexText(allTexts.centex.how)}
                  >
                    How/Why
                  </button>
                </li>
              </ul>
            </div>
            <Link
              className="inline-block px-4 py-2 border-2 rounded-lg mb-4 bg-gray-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              href={"https://www.centexqrs.com/"}
              target="_blank"
            >
              Check it out!
            </Link>
          </div>
          <div className="pane font-custom border-2 border-gray-500 bg-teal-500 rounded-xl shadow-xl text-gray-200">
            <div className="tracking-wide text-center text-3xl mt-4">
              Eggalytics!
            </div>
            <div className="scale-75">
              <div className="egg mx-auto"></div>
            </div>
            <div className="tracking-widest border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-200 p-2 mx-4 shadow-2xl">
              {eggText}
            </div>
            <div className="mb-4 border-gray-200 dark:border-gray-700 flex justify-around border-t-2 mx-4">
              <ul className="flex flex-wrap text-md tracking-wider font-medium text-center">
                <li className="me-2">
                  <button
                    className={`${
                      eggText === allTexts.eggText.about ? "text-gray-500" : ""
                    } inline-block px-4 py-2 rounded-b-lg bg-teal-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="profile-tab"
                    onClick={() => setEggText(allTexts.eggText.about)}
                  >
                    About
                  </button>
                </li>
                <li className="me-2">
                  <button
                    className={`${
                      eggText === allTexts.eggText.how ? "text-gray-500" : ""
                    } inline-block px-4 py-2 rounded-b-lg bg-teal-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="dashboard-tab"
                    onMouseUp={() => setEggText(allTexts.eggText.how)}
                  >
                    How/Why
                  </button>
                </li>
              </ul>
            </div>
            
            <Link
              className="inline-block shadow-md px-4 py-2 mb-4 rounded-lg border-2 tracking-wider bg-teal-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              id="dashboard-tab"
              href={"https://www.logan-duncan.com/eggalytics"}
              target="_blank"
            >
              Crack some eggs!
            </Link>
          </div>
          <div className="pane border-2 border-gray-500 bg-gray-800 rounded-xl shadow-xl text-gray-200">
            {" "}
            <div className="text-center text-2xl mt-4">The Forge Groans</div>
            <div className="flex flex-row justify-center scale-50 -mb-8 -mt-16">
              <pre>
                {" "}
                <div className="pl-6">(____)(___)</div>
                <div className="pl-12">(__)(__)</div>
                <div className="pl-20">(__ )</div>
                <div className="pl-6">_______(‾)______</div>
                <div className="pl-2">,_/__/‾‾‾~~ ~ ~ ‾\_\_</div>
                <div className="pl-2">|_.|\~_~_ ~ ~~ _~_/|_|</div>
                <div className="pl-2">|,_|_`|_|~ ~ ~ |_|_|._|</div>
                <div className="pl-2">|_&lsquo;|_|._|_~~~__|_|._|_|</div>
                <div className="pl-2">|._|&lsquo;_|_&lsquo;|_|_.|_|`_|,_|</div>
                <div className="pl-2">|_`|_.|_|&lsquo;_|,_|_&lsquo;|_|._|</div>
              </pre>{" "}
            </div>
            <div className="border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-200 p-2 mx-4 shadow-2xl">
              {forgeText}
            </div>
            <div className="mb-4 border-gray-200 dark:border-gray-700 flex justify-around border-t-2 mx-4">
              <ul className="flex flex-wrap text-md tracking-wider font-medium text-center">
                <li className="me-2">
                  <button
                    className={`${
                      forgeText === allTexts.forgeText.about
                        ? "text-gray-500"
                        : ""
                    } inline-block px-4 py-2 rounded-b-lg bg-teal-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="profile-tab"
                    onClick={() => setForgeText(allTexts.forgeText.about)}
                  >
                    About
                  </button>
                </li>
                <li className="me-2">
                  <button
                    className={`${
                      forgeText === allTexts.forgeText.how
                        ? "text-gray-500"
                        : ""
                    } inline-block px-4 py-2 rounded-b-lg bg-teal-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                    id="dashboard-tab"
                    onMouseUp={() => setForgeText(allTexts.forgeText.how)}
                  >
                    How/Why
                  </button>
                </li>
              </ul>
            </div>
            <button
              className="inline-block px-4 py-2 mb-4 rounded-lg border-2 bg-teal-800 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              id="dashboard-tab"
              // onMouseUp={() => setCentexText(allTexts.centex.how)}
            >
              Migrating, back soon!
            </button>
          </div>
          <div className="pane border-2 border-gray-500 bg-[#F3EEC3] rounded-xl shadow-xl text-black">
            <div className="text-center bg-[#F3EEC3] text-2xl mt-4">
              Push That Mountain!
            </div>
            <div className="mx-auto mb-12 h-[80px] w-[80px] -translate-x-1/4">
              <span className="text-[100px]">🌄</span>
            </div>
            <div className="border-t-2 border-l-2 border-r-2 rounded-t-lg border-gray-500 p-2 mx-4 shadow-2xl">
              {ptmText}
            </div>
            <div className="mb-4 border-gray-500 dark:border-gray-700 flex justify-around border-t-2 mx-4">
              <ul className="flex flex-wrap text-md tracking-wider font-medium text-center">
                <li className="me-2">
                  <button
                    className="inline-block px-4 py-2 rounded-b-lg bg-[#C08497] hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-400"
                    id="profile-tab"
                    onClick={() => setPtmText(allTexts.ptmText.about)}
                  >
                    About
                  </button>
                </li>
                <li className="me-2">
                  <button
                    className="inline-block px-4 py-2 rounded-b-lg bg-[#C08497] hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-400"
                    id="dashboard-tab"
                    onMouseUp={() => setPtmText(allTexts.ptmText.how)}
                  >
                    How/Why
                  </button>
                </li>
              </ul>
            </div>
            <button
              className="inline-block shadow-md px-4 py-2 mb-4 rounded-lg border-2 bg-[#C08497] hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              id="dashboard-tab"
              // onMouseUp={() => setCentexText(allTexts.centex.how)}
            >
              Taken Offline
            </button>
          </div>
          <div className="pane font-sans border-2 border-gray-500 bg-sky-400 rounded-xl shadow-xl text-black">
            <div className="inline-flex scale-150 mt-16">
              <div className="irl-logo align-items-end gap-1">
                <div className="flex">
                  <svg
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-hidden="true"
                    focusable="false"
                    className="flex-1 colors ic-inline h-12"
                  >
                    <path
                      d="M20.2941176,0 L33.3333333,0 L33.3333333,0 L33.3333333,33.3333333 L0,33.3333333 L0,20.2941176 C-4.92531394e-15,
             9.08598596 9.08598596,-1.49381329e-15 20.2941176,0 Z"
                      className="fill-[#375DDB]"
                    ></path>
                    <rect
                      x="33.3333333"
                      y="0"
                      width="33.3333333"
                      height="33.3333333"
                      className="fill-[#33b566]"
                    ></rect>
                    <path
                      d="M66.6666667,0 L79.7058824,0 C90.914014,-5.61161407e-15 100,9.08598596 100,20.2941176 L100,33.3333333 L100,
              33.3333333 L66.6666667,33.3333333 L66.6666667,0 Z"
                      className="fill-[#dd3263]"
                    ></path>
                    <rect
                      x="0"
                      y="33.3333333"
                      width="33.3333333"
                      height="33.3333333"
                      className="fill-[#1faff5]"
                    ></rect>
                    <rect
                      x="33.3333333"
                      y="33.3333333"
                      width="33.3333333"
                      height="33.3333333"
                      className="fill-[#78cc7d]"
                    ></rect>
                    <rect
                      x="66.6666667"
                      y="33.3333333"
                      width="33.3333333"
                      height="33.3333333"
                      className="fill-[#f56e4b]"
                    ></rect>
                    <path
                      d="M0,66.6666667 L33.3333333,66.6666667 L33.3333333,100 L20.2941176,100 C9.08598596,
               100 -2.18011342e-15,90.914014 0,79.7058824 L0,66.6666667 L0,66.6666667 Z"
                      className="fill-[#42cee0]"
                    ></path>
                    <rect
                      x="33.3333333"
                      y="66.6666667"
                      width="33.3333333"
                      height="33.3333333"
                      className="fill-[#c2dc80]"
                    ></rect>
                    <path
                      d="M66.6666667,66.6666667 L100,66.6666667 L100,79.7058824 C100,90.914014 90.914014,100 79.7058824,100 L66.6666667,100 L66.6666667,
               100 L66.6666667,66.6666667 Z"
                      className="fill-[#ffae4a]"
                    ></path>
                    <path
                      d="M24.492 64.168c-.786-1.913.111-4.107 2.004-4.902s4.065.112 4.851 2.024a20.6
                20.6 0 0 0 4.424 6.667c3.801 3.833 8.932 6.022 14.417 6.022s10.617-2.189 14.417-6.022a20.6 20.6 0 0 0 4.424-6.667c.786-1.913
                 2.958-2.819 4.851-2.024s2.79 2.989 2.004 4.902c-1.4 3.405-3.455 6.495-6.035 9.098-5.179 5.223-12.19 8.214-19.661 8.214s-14.482-2.991-19.661-8.214c-2.58-2.602-4.635-5.693-6.035-9.098z"
                      fill="#fff"
                    ></path>
                  </svg>{" "}
                  <svg
                    viewBox="0 0 34 30"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-hidden="true"
                    focusable="false"
                    className="flex-1 irl-logo-text ic-inline irl-logo-text h-10"
                  >
                    <g
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <path
                        d="M4.14404432,12.6776335 C3.26500022,12.6776335 2.60572704,12.4756634 2.16620499,
                 12.0717172 C1.72668294,11.6677709 1.50692521,11.1032905 1.50692521,10.3782588 C1.50692521,9.65322709 1.79470319,9.04731685 2.37026777,8.56050986 C2.94583236,
                 8.07370287 3.66266114,7.83030303 4.52077562,7.83030303 C5.29517162,7.83030303 5.92305084,8.01673695 6.40443213,8.38961039 C6.88581343,8.76248383 7.12650046,
                 9.29071327 7.12650046,9.97431457 C7.12650046,10.8029222 6.85441946,11.4606197 6.31024931,11.9474266 C5.76607915,12.4342336 5.04401804,12.6776335 4.14404432,
                 12.6776335 Z M30.7663897,0 C31.7710115,0 32.5610928,0.460906085 33.1366574,1.38273208 C33.712222,2.30455808 34,3.6251317 34,5.34449254 C34,7.80960027 33.3145652,
                 10.6682537 31.943675,13.9205387 C30.5727848,17.1728237 28.7048441,20.3836301 26.3397969,23.5530544 C26.4863042,24.4023772 26.7479206,25.0134661 27.1246537,
                 25.3863396 C27.5013869,25.759213 28.014155,25.9456469 28.6629732,25.9456469 C29.0187768,25.9456469 29.421666,25.8420725 29.8716528,25.6349206 C30.3216397,
                 25.4277687 30.7349935,25.1584753 31.1117267,24.8270322 C31.3419525,24.6198803 31.5721749,24.5163059 31.8024007,24.5163059 C32.0535562,24.5163059 32.2576169,
                 24.6561314 32.4145891,24.9357864 C32.5715613,25.2154415 32.6500462,25.5520583 32.6500462,25.9456469 C32.6500462,26.815685 32.3361066,27.5096335 31.7082179,
                 28.0275132 C30.6198776,28.9182664 29.3850485,29.3636364 28.0036934,29.3636364 C26.0153794,29.3636364 24.5607925,28.5402199 23.6398892,26.8933622 C23.1779368,
                 26.0672495 22.8318506,25.1147391 22.6016289,24.0358228 L22.2742382,24.2211159 L22.2742382,24.2211159 C21.4893774,24.6457773 20.6574375,24.8581049 19.7783934,
                 24.8581049 C18.6691234,24.8581049 17.8267188,24.578454 17.2511542,24.0191438 C16.6755896,23.4598337 16.3878116,22.7037405 16.3878116,21.7508418 C16.3878116,
                 21.4401139 16.4192056,21.1293907 16.4819945,20.8186628 C16.5238537,20.404359 16.544783,20.1247081 16.544783,19.9797018 C16.544783,19.6482587 16.4296718,
                 19.4825397 16.199446,19.4825397 C15.8855017,19.4825397 15.4721478,19.8295139 14.9593721,20.5234728 C14.4465964,21.2174317 13.9390607,22.1340652 13.4367498,
                 23.2734007 C12.9344389,24.4127362 12.5263174,25.6141992 12.212373,26.8778259 C11.9821472,27.8514399 11.7152985,28.5091373 11.411819,28.850938 C11.1083395,
                 29.1927386 10.6321978,29.3636364 9.9833795,29.3636364 C9.18805389,29.3636364 8.62819491,28.9493388 8.30378578,28.1207311 C8.21593098,27.8963319 8.13997255,
                 27.6354718 8.07591039,27.3381499 C6.60818366,28.6885891 5.21390592,29.3636364 3.89289012,29.3636364 C2.53246473,29.3636364 1.54355495,28.8871941 0.926131117,
                 27.9342953 C0.308707285,26.9813966 0,25.7177889 0,24.1434343 C0,23.2112508 0.120343518,22.0149664 0.361034164,20.5545455 C0.601724811,19.0941245 0.910432096,
                 17.7321211 1.28716528,16.4684945 C1.47553187,15.8056084 1.72668356,15.349881 2.04062789,15.1012987 C2.35457221,14.8527164 2.85687559,14.7284271 3.54755309,
                 14.7284271 C4.61496379,14.7284271 5.14866113,15.0805801 5.14866113,15.7848966 C5.14866113,16.3027764 4.94983271,17.5042394 4.5521699,19.3893218 C4.04985898,
                 21.6679928 3.79870729,23.2112514 3.79870729,24.0191438 C3.79870729,24.6405995 3.88242452,25.1170418 4.0498615,25.4484848 C4.21729847,25.7799279 4.49984412,
                 25.9456469 4.89750693,25.9456469 C5.27424011,25.9456469 5.74514953,25.6867109 6.31024931,25.1688312 C6.71691363,24.7961479 7.22112175,24.2679179 7.8228821,
                 23.5841319 L7.81717452,24.1434343 C7.81717452,21.4504595 8.2043667,18.8921718 8.9787627,16.4684945 C9.16712929,15.8677539 9.47583657,15.4275627 9.90489381,
                 15.1479076 C10.3339511,14.8682526 10.9356686,14.7284271 11.7100646,14.7284271 C12.1286571,14.7284271 12.4216674,14.7802143 12.5891043,14.8837903 C12.7565413,
                 14.9873662 12.8402585,15.1841576 12.8402585,15.4741703 C12.8402585,15.8056133 12.6832887,16.551349 12.3693444,17.7113997 C12.1600482,18.5400073 11.9926137,
                 19.2650282 11.867036,19.8864839 C11.7414583,20.5079396 11.6368117,21.2743902 11.5530933,22.1858586 C12.2437708,20.4043522 13.0181551,18.9543105 13.8762696,
                 17.8356902 C14.7343841,16.7170699 15.5767887,15.919547 16.4035088,15.4430976 C17.2302288,14.9666483 17.9889162,14.7284271 18.6795937,14.7284271 C20.0400191,
                 14.7284271 20.7202216,15.4016607 20.7202216,16.7481481 C20.7202216,17.0174456 20.6260397,17.6699644 20.4376731,18.7057239 C20.2702362,19.5343315 20.1865189,
                 20.0522035 20.1865189,20.2593555 C20.1865189,20.9843871 20.4481353,21.3468975 20.9713758,21.3468975 C21.3365078,21.3468975 21.7666351,21.169982 22.2617634,
                 20.8161476 C22.2595531,20.693301 22.2585411,20.5700982 22.2585411,20.4457912 C22.2585411,17.9185379 22.5881777,15.0391696 23.2474608,11.8075998 C23.9067438,
                 8.57603002 24.8799566,5.80023607 26.1671283,3.48013468 C27.4543001,1.16003329 28.9873718,0 30.7663897,0 Z M30.0757156,3.07619048 C29.5943343,3.07619048 29.0501723,
                 3.93585801 28.4432133,5.65521886 C27.8362543,7.3745797 27.3025569,9.50821237 26.8421053,12.0561809 C26.3816536,14.6041493 26.1305019,17.0485052 26.0886427,
                 19.3893218 C27.5746458,16.9656444 28.7571517,14.5368247 29.6361958,12.1027898 C30.5152399,9.66875487 30.9547553,7.44708396 30.9547553,5.43771044 C30.9547553,
                 3.86335592 30.661745,3.07619048 30.0757156,3.07619048 Z"
                        fill="currentcolor"
                      ></path>
                    </g>
                  </svg>
                </div>{" "}
                <div className="text-xs line-xs text-uppercase font-extrabold mb-6 flex-shrink-0 flex-basis-100 gap-1 d-flex text-gray-500">
                  IN REAL LIFE
                  <span className="text-3xs line-3xs text-gray-400 pt-4"> TM</span>
                </div>
              </div>
            </div>

            <div className="font-sans border-t-2 border-l-2 border-r-2 rounded-t-lg bg-sky-200 border-gray-500 p-2 mx-4 shadow-2xl">
              {irlText}
            </div>
            
            <div className="mb-4 border-gray-500 dark:border-gray-700 flex justify-around border-t-2 mx-4">
              <ul className="flex flex-wrap text-md text-center">
                <li className="me-2 font-sans">
                  <button
                    className="inline-block px-4 py-2 rounded-b-lg bg-sky-200 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-400"
                    id="profile-tab"
                    onClick={() => setIrlText(allTexts.irlText.about)}
                  >
                    About
                  </button>
                </li>
                <li className="me-2">
                  <button
                    className="inline-block px-4 py-2 rounded-b-lg bg-sky-200 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-400"
                    id="dashboard-tab"
                    onMouseUp={() => setIrlText(allTexts.irlText.how)}
                  >
                    How/Why
                  </button>
                </li>
              </ul>
            </div>
            <button
              className="inline-block px-4 py-2 mb-4 rounded-lg border-2 bg-sky-200 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              id="dashboard-tab"
              // onMouseUp={() => setCentexText(allTexts.centex.how)}
            >
              Shutdown (RIP)
            </button>
          </div>
        </div>
      </div>
      <div className="mt-60 flex mx-auto justify-between w-3/4 text-5xl font-bold">
        <button className="border-2 shadow-md border-black rounded-md h-16 aspect-[1/1]" onClick={handlePrevClick}>
          {"<"}
        </button>
        <button className="border-2 shadow-md border-black rounded-md h-16 aspect-[1/1]" onClick={handleNextClick}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Carousel;
