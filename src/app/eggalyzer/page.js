"use client";
import "../globals.css"
import Carton from "./Carton";
import { useState, useEffect, Suspense } from "react";
import StatsModal from "./StatsModal";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  sendData,
  getSharedData,
  createShareLink,
  eggResetVals,
} from "./serverCalls";

function ParamCheck({setShow, setIsShared, getSharedData, setOrder, setData}) {
  const params = useSearchParams()
  useEffect(() => {
    const shared = params.get("shared");
    if (shared !== null) {
      console.log("teest");
      setShow(true);
      setIsShared(true);
      getSharedData(setOrder, setData, shared);
    }
  }, [getSharedData, params, setData, setIsShared, setOrder, setShow]);
  return <></>
}

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  // const params = useSearchParams();
  const [show, setShow] = useState(false);
  const [order, setOrder] = useState([]);
  const [data, setData] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(
    "Click to get a sharable link!"
  );
  const [eggs, setEggs] = useState(eggResetVals);

  const changeHover = (eggnum, bool) => {
    setEggs((eggs) => ({
      ...eggs,
      [eggnum]: {
        ...eggs[eggnum],
        hover: bool,
      },
    }));
  };

  const crackEgg = (eggnum, bool) => {
    setEggs((eggs) => ({
      ...eggs,
      [eggnum]: {
        ...eggs[eggnum],
        used: bool,
      },
    }));
    const justNum = eggnum.slice(3);
    setOrder((order) => [...order, Number(justNum)]);
  };

  const resetCarton = () => {
    setEggs(eggResetVals);
    router.replace(pathname);
    setOrder([]);
    setIsShared(false);
    setShow(false);
    setData([]);
  };

  // useEffect(() => {
  //   const shared = params.get("shared");
  //   if (shared !== null) {
  //     console.log("teest");
  //     setShow(true);
  //     setIsShared(true);
  //     getSharedData(setOrder, setData, shared);
  //   }
  // }, [params]);

  return (
    <div className="justify-center items-center min-h-[calc(100dvh)] min-w-[calc(100dvw)]">
      <Suspense><ParamCheck setShow={setShow} setIsShared={setIsShared} getSharedData={getSharedData} setOrder={setOrder} setData={setData} /></Suspense>
      <div className="text-center mb-18 lg:mb-32">
        <p className="text-3xl text-gray-600 -mb-1 pt-16 font-custom">
          Click to find out how your order compares to others
        </p>
        <p className="text-9xl text-gray-800 pb-4 font-custom">
          Eggcellent Choices!
        </p>
      </div>

      <Carton
        order={order}
        setOrder={setOrder}
        changeHover={changeHover}
        crackEgg={crackEgg}
        eggs={eggs}
        resetCarton={resetCarton}
      />
      <div className="flex mx-auto justify-center items-center -mt-12 md:-mt-12">
        <button
          onClick={() => sendData(setShow, order, setData)}
          disabled={order.length <= 11 ? true : false}
          className={`font-custom z-30 text-3xl border-black border-2 shadow-md rounded-lg px-4 py-2 transition-colors ${
            order.length <= 11 ? "" : "bg-yellow-300"
          } focus:bg-yellow-600`}
        >
          {order.length <= 11 ? `${12 - order.length} left` : "Eggalyze!"}
        </button>
      </div>
      <StatsModal
        show={show}
        handleClose={resetCarton}
        data={data}
        order={order}
        generatedLink={generatedLink}
        createShareLink={() =>
          createShareLink(setGeneratedLink, order, data, setGenerated)
        }
        isShared={isShared}
        generated={generated}
        setGenerated={setGenerated}
      />
    </div>
  );
}
