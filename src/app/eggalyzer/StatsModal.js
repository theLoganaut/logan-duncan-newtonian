"use client"
import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Container } from "react-bootstrap";

const StatsModal = ({
  show,
  handleClose,
  data,
  order,
  generatedLink,
  createShareLink,
  isShared,
  generated,
}) => {
  const [current, setCurrent] = useState([]);
  const [copied, setCopied] = useState(false);
  const maxValue = Math.max(...current);
  const minValue = Math.min(...current);

  const userMax = Math.max(...order);
  const userMin = Math.min(...order);

  const getUserColor = (itemValue) => {
    // get percentage relative to min and max values
    const percentage = ((itemValue - userMin) / (userMax - userMin)) * 100;

    // get RGB values based on percentage
    const red = Math.round(254 - (percentage * (254 - 161)) / 100);
    const green = Math.round(240 - (percentage * (240 - 98)) / 100);
    const blue = Math.round(138 - (percentage * (138 - 7)) / 100);

    return `rgb(${red}, ${green}, ${blue})`;
  };

  // function to calculate background color based on item value
  const getBackgroundColor = (itemValue) => {
    // get percentage relative to min and max values
    const percentage = ((itemValue - minValue) / (maxValue - minValue)) * 100;

    // get RGB values based on percentage
    const red = Math.round(254 - (percentage * (254 - 161)) / 100);
    const green = Math.round(240 - (percentage * (240 - 98)) / 100);
    const blue = Math.round(138 - (percentage * (138 - 7)) / 100);

    return `rgb(${red}, ${green}, ${blue})`;
  };

  const orderFixer = (arr) => {
    const indexedArray = arr.map((value, index) => ({ value, index }));

    // sort the array based on the value
    indexedArray.sort((a, b) => a.value - b.value);

    // create the new array with the indices of the sorted values
    const result = indexedArray.map((item) => item.index);

    return result;
  };

  const newOrder = orderFixer(order);

  const decisionNum =
    data?.findIndex((arr) => arr.toString() === current.toString()) + 1;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  //! in the future move each analytic to its own component for readability
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      
      <Modal.Header className="bg-teal-500 -mb-1 shadow-lg" closeButton>
        <Modal.Title>
          <div className="font-custom text-5xl">Eggxamine Your Eggcellence</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-teal-500 text-center">
        {data.length < 6 ? (
          <>
            <div className="font-custom text-3xl">
              Give me a cluck to load please!
            </div>
            <div className="egg mx-auto my-12"></div>
          </>
        ) : (
          <>
            <div className="font-custom text-2xl">
              How you Eggspressed yourself
            </div>
            <div className="font-custom text-xl">
              Click each egg to learn more!
            </div>
            <div className="flex flex-wrap justify-between px-10 font-custom">
              {newOrder?.map((item, index) => (
                <div key={index} className="w-1/6 mb-2 px-2">
                  <div
                    style={{ backgroundColor: getUserColor(item) }}
                    onMouseUp={() => setCurrent(data[item])}
                    className="w-10 h-10 border-black border-1 shadow-lg flex items-center justify-center rounded-full transition duration-300 ease-in-out hover:opacity-25 hover:cursor-pointer"
                  >
                    #{item + 1}
                  </div>
                  <div className="text-lg">egg {index + 1}</div>
                </div>
              ))}
            </div>
            {current ? (
              <>
                <div className="font-custom text-2xl">
                  Eggxploring total cracks combined at decision {decisionNum}
                </div>
                <div className="flex flex-wrap justify-between px-10 font-custom">
                  {current?.map((item, index) => (
                    <div key={index} className="w-1/6 mb-2 px-2">
                      <div
                        style={{ backgroundColor: getBackgroundColor(item) }}
                        className={`w-10 h-10 border-black border-1 shadow-lg flex items-center justify-center rounded-full`}
                      >
                        #{item}
                      </div>
                      <div className="font-custom text-med">
                        egg {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-around font-custom">
                  <div>
                    <div className="text-2xl">The Eggxtra Special</div>
                    <div className="w-10 h-10 mx-auto border-black border-1 shadow-lg flex items-center justify-center rounded-full transition duration-300 ease-in-out bg-yellow-100 hover:bg-yellow-300">
                      egg {current.indexOf(maxValue) + 1}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl">Most Eggnored</div>
                    <div className="text-med w-10 h-10 mx-auto border-black border-1 shadow-lg flex items-center justify-center rounded-full transition duration-300 ease-in-out bg-yellow-100 hover:bg-yellow-300">
                      egg {current.indexOf(minValue) + 1}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        )}
        <div className="font-custom text-3xl mt-2">More eggalytics coming soon!</div>
        <div className="w-3/4 mx-auto text-xl font-custom border-2 rounded-md shadow-md p-2 m-2">
          <div className="">How many people followed and fell at each step!</div>
          <div className="">The egg thats most likely to be picked next!</div>
          <div className="">Common patterns within the paths!</div>
          <div className="">
            Groups of two {"("}maybe more?{")"} and bigger cartons!
          </div>
        </div>
      </Modal.Body>
      <div className="bg-teal-500 -mt-1 transition-transform">
        <Modal.Footer>
          {isShared ? (
            <></>
          ) : (
            <div className="w-3/4 mx-auto justify-around">
              <div className="relative">
                <label className="sr-only">Label</label>
                <input
                  type="text"
                  className="col-span-4 overflow-x-clip bg-teal-400 border-2 border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={generatedLink}
                  disabled
                  readonly
                />

                {generated ? (
                  <button
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-white dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200"
                    onMouseUp={handleCopy}
                  >
                    {copied ? (
                      <>
                        <div
                          id="success-message"
                          className="items-center inline-flex"
                        >
                          <svg
                            className="w-3 h-3 text-blue-700 dark:text-blue-500 me-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 16 12"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5.917 5.724 10.5 15 1.5"
                            />
                          </svg>
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-500">
                            Copied
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          id="default-message"
                          className="inline-flex items-center"
                        >
                          <svg
                            className="w-3 h-3 me-1.5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 18 20"
                          >
                            <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                          </svg>
                          <span className="text-xs font-semibold">Copy</span>
                        </div>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    data-copy-to-clipboard-target="npm-install-copy-text"
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-900 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-2 px-2.5 inline-flex items-center justify-center bg-white border-gray-200 border"
                    onMouseUp={createShareLink}
                  >
                    <svg
                      className="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4"
                      />
                    </svg>
                    <span className="text-xs font-semibold">Generate</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <Button variant="danger" className="mx-auto" onClick={handleClose}>
            Close and reset your eggalytics!
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default StatsModal;
