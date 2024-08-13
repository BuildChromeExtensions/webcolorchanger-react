/* eslint-disable no-unused-vars */
/*global chrome*/


import { useEffect, useState } from 'react'

function App() {

  const [color, setColor] = useState("#000000");

  useEffect(() => {

    // get active tab
    chrome.tabs.query({ active: true }, (tabs) => {
      if (tabs[0].url) {
        //send to content scripts to get the color
        chrome.tabs.sendMessage(tabs[0].id, { action: "get-color" });
      }
    });

    const listener = (request, sender, sendResponse) => {
      // change the color of the input to make the website as a default
      if (request.action === "web-color") {
        const color = request.color;
        const inputcolor = document.querySelector('input');
        if (color.includes("#")) {
          setColor(color);
        } else {
          // convert rgb e.g rgb(216, 19, 19) to #d81313
          // const values = color
          //     .replace("(", "")
          //     .replace(")", "")
          //     .replace("rgb", "")
          //     .split(",")
          // const [r, g, b] = values;
        }
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);


  const onChangeColor = () => {
    const inputcolor = document.querySelector('input');
    const color = inputcolor.value;

    // you can send numbers, strings, arrays, and objects
    // send background scripts background.js
    chrome.runtime.sendMessage({ action: "change-color", color: color });

    // get active tab
    chrome.tabs.query({ active: true }, (tabs) => {
      if (tabs[0].url) {
        //send to content scripts
        chrome.tabs.sendMessage(tabs[0].id, { action: "change-color", color: color })
      }
    });
  }

  return (
    <>
      <h1>Web Color Changer</h1>
      <input value={color} onChange={(e) => setColor(e.target.value)} type="color" />
      <button onClick={onChangeColor}>Change Color</button>
    </>
  )
}

export default App
