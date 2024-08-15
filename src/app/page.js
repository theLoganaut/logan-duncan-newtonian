"use client";
import "./globals.css";
import Image from "next/image";
import NewtonCradleTop from "./NewtonCradleTop";
import NewtonCradleBottom from "./NewtonCradleBottom";
import TextAnimation from "./TextAnimation";
import CircleCollage from "./CircleCollage";
import ProjectsPanel from "./ProjectsPanel";
import { Link, Element } from "react-scroll";
import ScrollToast from "./ScrollToast";

export default function Home() {
  const text =
    "As a gamer from a young age with a burning curiosity, diving into how games worked sparked my journey into programming. How does Bulbasaur attack? If my stats are numbers, is my damage a number? How does a stat effect my damage? How are things even put on the screen?";
  const text2 =
    "Just some of the infinite questions I asked and tried to find out, before realizing I could find answers by making something myself. No that would be too hard… well until I grew up. Now I see that I can make nearly anything on the web with React, bring it to mobile with React Native, and give the people servers with Amazon!";
  const text3 =
    "I’ve got a problem though… I’m a dreamer with a perfectionist streak so it's hard creating something that’s good enough for me and wouldn’t take several years by myself. There’s a junkyard of scrapped projects but I’ve kept everything I’ve learned and I’m ready to apply it to anything I do. Currently I’m applying that to creating and tuning a RL algorithm to play doom64. That and an ASCII ‘idle’ game that runs in the browser. I do some QR design and creation for businesses called CentexQRs as well but it’s sunsetting, and I’m really looking forward to my next big project under someone this time!";

  const items = [
    {
      weight: 25,
      color: "#c780ff",
      title: "JavaScript",
      text: "Frontend Logic, Node backends, APIs and Databases. What can't JavaScript do?!.. Well first you must get one of these libraries, a nice framework or two, a hundred packages, and to run in this environment with this version list, and theres no typing so think about TypeScript.....",
    },
    {
      weight: 22,
      color: "#a880ff",
      title: "CSS/HTML",
      text: "Does HTML qualify if it's mostly divs? Well what good's a beautiful art peice without the frame it rests upon! The steps to a final look can be long but bootstraps, preprocessors and libraries shorten it (React/Tailwind/Bootstrap bais).",
    },
    {
      weight: 20,
      color: "#8a80ff",
      title: "UI/UX",
      text: "While it can be limiting, mobile first design gives every user the chance to experience the journey how I intended. From accessibility to user flow, a strong UI allows for strong UX and the two blend together until the user doesn't have to think about it.",
    },
    {
      weight: 18,
      color: "#809cff",
      title: "API C&C",
      text: "Well I couuuld write a custom NodeJS server with ExpressJS to help, or I could just offload all that to a microservice ecosystem with AWS using API gateway, Lambda, DynamoDB, AppSync, and Cognito and work on coding the actual data storage and transformations instead of infrastructure. ",
    },
    {
      weight: 15,
      color: "#80c3ff",
      title: "Debug/Test",
      text: "Enterprise level tech has hundreds if not thousands of moving parts, its not just about having a linter, or event logging or even automated tests, something is bound to go wrong. When that happens you need an engineer that knows the system.",
    },
    {
      weight: 15,
      color: "#80e6ff",
      title: "Analytics",
      text: "Using Lambda+DynamoDB to run analytics and save the result makes it easier than I'd imagined. My eggsite takes user data and incrementally updates Order Distribution, Path Analysis, Pattern Clustering, and Choice Prediction, serving it back to the user for a comparison.",
    },
    {
      weight: 13,
      color: "#80ffea",
      title: "Microservices",
      text: "Properly chained microservices can create some harmonious software, but getting there can be like training a symphony from scratch. Luckily due to AWS/GoogleE/Meta/Azure/Etc everywhere I've learned to be a great composer no matter the music selection.",
    },
    {
      weight: 12,
      color: "#80ffc1",
      title: "Python",
      text: "Diversifying my language-folio, I'd like to dive more into ML training and other python heavy workflows. Working on training a Doom64 ML with VizDoom64 as you read this. My Eggsite runs python on a Lambda server to run analytics and transform data.",
    },
    {
      weight: 10,
      color: "#80ff9a",
      title: "(Auth)²",
      text: "When done right authentication and authorization should be something a user don't notice past maybe a login. Using anything from AWS IAM/Cognito to AuthO for authentication, and keeping users within their bounds with HTTP rails.",
    },
    {
      weight: 8,
      color: "#87ff80",
      title: "Containers",
      text: "Containers are a miracle. Separate environments for testing, development, production, platforms, environments. Docker and Kubernetes might not be a breeze but its definitely easier.",
    },
  ];
  return (
    <div className="bg-[#98cfb2] justify-center content-center mx-auto">
      <div className="h-screen mx-auto">
        {/* <div className="overflow-hidden"> */}
        <NewtonCradleTop />
        <NewtonCradleBottom />
        {/* </div> */}
        <div className="w-full text-center absolute text-2xl mt-8 md:mt-24 top-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 font-mono">
          Human that codes.
        </div>
        <div className="absolute text-center text-2xl top-1/3 mt-20 md:mt-32 left-1/2 w-full -translate-x-1/2 translate-y-1/2 font-mono mx-auto">
          Awaiting my AI replacement.
        </div>
        <div className="absolute text-xl top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 font-mono">
          <div className="text-center">
            <Link to="bio-nary" smooth={true} duration={50}>
              <div className="flex-none bg-gray-200 p-4 m-2 rounded-lg hover:opacity-50 cursor-pointer">
                Bio-nary
              </div>
            </Link>
            <Link to="matrix" smooth={true} duration={50}>
              <div className="flex-none w-max bg-gray-300 p-4 m-2 rounded-lg hover:opacity-50 cursor-pointer">
                Additions to the Matrix
              </div>
            </Link>
            <Link to="implants" smooth={true} duration={50}>
              <div className="flex-none bg-gray-400 p-4 m-2 rounded-lg hover:opacity-50 cursor-pointer">
                Implants & Augments
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Element name="bio-nary" />
      <div className="h-min-screen font-mono pt-12 -mx-8">
        <div className="text-center lg:py-2 border-2 bg-[#4db6ac] border-black bg-opacity-30 rounded-lg m-12 shadow-xl md:w-1/2 md:mx-auto px-2">
          <div className="flex flex-wrap lg:py-2">
            <div className="w-full lg:w-1/4 p-1 lg:p-4 my-auto">
              <div>Unevolved</div>
              <Image
                src="/loganPlaneGameboy.png"
                className="mx-auto mb-4 mt-3 lg:mb-0 z-10 lg:mt-4 shadow-lg border-2 rounded-full xl:scale-125 lg:hover:scale-150 hover:scale-125 duration-500"
                width={125}
                height={125}
                alt="Picture of the author"
              />
            </div>
            <div className="w-full lg:w-3/4 border-gray-500"> 
                <TextAnimation text={text} />
            </div>
          </div>
          <div className="flex flex-wrap lg:py-2">
            <div className="w-full lg:w-1/4 p-2 lg:p-4 my-auto">
              <div className="pb-2">level 15</div>
              <Image
                src="/loganTeenGaming.png"
                className="mx-auto z-10 mb-4 mt-3 lg:mb-0 lg:mt-4 shadow-lg border-2 rounded-full lg:hover:scale-150 hover:scale-125 duration-500"
                width={125}
                height={125}
                alt="Picture of the author"
              />
            </div>
            <div className="w-full lg:w-3/4 border-gray-500">     
                <TextAnimation text={text2} />
            </div>
          </div>
          <div className="flex flex-wrap lg:py-2">
            <div className="w-full lg:w-1/4 p-1 lg:p-4 border-gray-500 my-auto h-full">
              <div>level 24</div>
              <Image
                src="/loganlevel24.jpg"
                className="mx-auto z-10 mb-4 mt-3 lg:mb-0 lg:mt-4 items-center h-full lg:my-4 shadow-lg border-2 rounded-full xl:scale-125 lg:hover:scale-150 hover:scale-125 duration-500"
                width={125}
                height={125}
                alt="Picture of the author"
              />
            </div>
            <div className="w-full lg:w-3/4 my-auto">    
                <TextAnimation text={text3} />
            </div>
          </div>
        </div>
      </div>
      <Element name="matrix" />
      <div className="min-h-screen font-mono flex">
        <div className="my-auto mx-auto">
          <ProjectsPanel />
        </div>
      </div>
      <Element name="implants" />
      <div className="min-h-screen font-mono md:mb-3 text-xs sm:text-2xl -ml-12 sm:-ml-0">
        <CircleCollage items={items} />
      </div>
      {/* <ScrollToast /> */}
    </div>
  );
}
