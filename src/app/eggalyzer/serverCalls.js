export async function sendData(setShow, order, setData) {
  setShow(true);
  const url = `https://dd7qc7r6a6nsijrpxaq6f33zsu0vbjtm.lambda-url.us-east-1.on.aws/`;
  const toJSON = {
    order: order,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toJSON),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorDetails}`
      );
    }

    const data = await response.json();
    console.log("Success:", data);
    setData(data.FreqAndHeat);
  } catch (error) {
    if (error.name === "TypeError") {
      console.error(
        "Network error or no response from the server:",
        error.message
      );
    } else {
      console.error("Fetch error:", error.message);
    }
  }
}

export async function getSharedData(setOrder, setData, shared) {
  const url = `https://7thojfktcsgjj2x35hfbfeuery0ydgib.lambda-url.us-east-1.on.aws/?shared=${shared}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorDetails}`
      );
    }

    const res = await response.json();
    setOrder(res.data.Item.order);
    setData(res.data.Item.FreqAndHeat);
  } catch (error) {
    if (error.name === "TypeError") {
      console.error(
        "Network error or no response from the server:",
        error.message
      );
    } else {
      console.error("Fetch error:", error.message);
    }
  }
}

export const createShareLink = async (setGeneratedLink, order, data, setGenerated) => {
  setGeneratedLink("Generating Link...")
  //organize data and stringify
  const toSend = {
    order: order,
    FreqAndHeat: data,
  };
  //call lambda function to save data
  const url = `https://7thojfktcsgjj2x35hfbfeuery0ydgib.lambda-url.us-east-1.on.aws/`;


  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorDetails}`
      );
    }

    const data = await response.json();
    console.log("Success:", data);
    const link = `https://www.logan-duncan.com/eggalyzer/shared=${data.Id}`;
    setGeneratedLink(link);
    setGenerated(true)
    //build string from return Id
  } catch (error) {
    if (error.name === "TypeError") {
      console.error(
        "Network error or no response from the server:",
        error.message
      );
    } else {
      console.error("Fetch error:", error.message);
    }
    setGeneratedLink("Oops, humpty dumpty fell. Try again?");
  }
};

export const eggResetVals = {
  egg0: {
    hover: false,
    used: false,
  },
  egg1: {
    hover: false,
    used: false,
  },
  egg2: {
    hover: false,
    used: false,
  },
  egg3: {
    hover: false,
    used: false,
  },
  egg4: {
    hover: false,
    used: false,
  },
  egg5: {
    hover: false,
    used: false,
  },
  egg6: {
    hover: false,
    used: false,
  },
  egg7: {
    hover: false,
    used: false,
  },
  egg8: {
    hover: false,
    used: false,
  },
  egg9: {
    hover: false,
    used: false,
  },
  egg10: {
    hover: false,
    used: false,
  },
  egg11: {
    hover: false,
    used: false,
  },
}
