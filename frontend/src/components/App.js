import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { texts } from "../texts.js";

var currentZoomListener = null;
window.addEventListener('mousewheel', (e) => {
  console.log("?", e);
  e.preventDefault();
  currentZoomListener && currentZoomListener(e);
}, { passive: false });


function zoomChange(zoom, e) {
  var newZoom = zoom - ((e.deltaY * (e.deltaMode ? 120 : 1)) > 0 ? 0.2 : -0.2) ;
  if (newZoom < 1) return 1;
  if (newZoom > 2) return 2;
  return newZoom;
}

// const INITIAL_IMAGE_SIZE = 

const App = () => {
  const [zoom, setZoom] = useState(1);
  var [currentSelection, setCurrentSelection] = useState(null);

  if (currentSelection)
    currentSelection = texts[currentSelection.svg_id] || currentSelection;

  useEffect(() => {
    currentZoomListener = e => {
      console.log(zoomChange(zoom, e));
      setZoom(zoomChange(zoom, e));
    }
  });

  return <div
      onWheel={e => console.log(e)}
      style={{
        width: 1024,
        height: 512,
        border: "1px black solid",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden"
      }}>

    <img
      src="/static/map_big.jpg"
      onWheel={e => console.log(e)}
      style={{
        position: "absolute",
        width: 1024 * zoom
      }}/>

    <object
      id="svg-object"
      data="static/plashki.svg"
      type="image/svg+xml"
      onWheel={e => console.log(e)}
      style={{
        position: "absolute",
        top: -29 * zoom,
        width: 1024 * zoom
      }}
      onLoad={(e) => {
        var svgDoc = e.currentTarget.contentDocument;
        var styleElement = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
        styleElement.textContent = document.getElementsByTagName("style")[0].innerText; // add whatever you need here
        // svgDoc.getElementById("where-to-insert").appendChild(styleElement);
        svgDoc.getElementsByTagName("svg")[0].appendChild(styleElement);

        svgDoc.addEventListener('mousewheel', (e) => {
          console.log("? svg", e);
          e.preventDefault();
          currentZoomListener && currentZoomListener(e);
        }, { passive: false });

        svgDoc.querySelectorAll("svg > g").forEach(el => {
          el.onclick = () => {
            console.log(el.id);
            console.log(texts[el.id]);
            setCurrentSelection({
              svg_id: el.id
            });
          }
        });
      }}>
      
    </object>
    
    { !currentSelection ? null : 
        <div style={{
            position: "absolute",
            background: "rgba(1, 1, 1, 0.5)",
            width: "100%",
            height: 1024,
            // height: "100%",
          }}
          onClick={e => setCurrentSelection(null)}>

          <div
          style={{
            margin: "0 auto",
            width: 540,
            backgroundColor: "white",
            paddingBottom: 30,
            position: "relative"
          }}
          onClick={e => e.stopPropagation()}>

            <button
              onClick={e => setCurrentSelection(null)}
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                background: 0,
                color: "#CC2229",
                border: 0,
                right: 0,
                fontSize: 20,
                cursor: "pointer"
              }}>X</button>

            <img
              src={"/static/pics/" + currentSelection.image_id + ".jpg"}
              style={{
                width: 500,
                margin: 15
              }}
              />

            <p style={{
              width: 470,
              marginLeft: 30,
              marginRight: 30,
              color: "#CC2229",
              textAlign: "justify"
            }}>{currentSelection.english_text || currentSelection.svg_id}</p>
          </div>
        </div>
    }
    

  </div>;
}

// const App = () => (
//   <DataProvider endpoint="api/lead/" 
//                 render={data => <Table data={data} />} />
// );

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
