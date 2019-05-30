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
  var newZoom = zoom - ((e.deltaY * (e.deltaMode ? 120 : 1) / 10) > 0 ? 0.5 : -0.5) ;
  if (newZoom < 0.1) return 0.1;
  if (newZoom > 20) return 20;
  return newZoom;
}

const App = () => {
  const [zoom, setZoom] = useState(2);
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
      style={{
        width: 1024,
        height: 1024,
        margin: "0 auto",
        position: "relative",
        overflow: "hidden"
      }}>

    <img
      src="/static/map_big.jpg"
      style={{
        position: "absolute",
        width: 400 * zoom
      }}/>

    <object
      id="svg-object"
      data="static/plashki.svg"
      type="image/svg+xml"
      style={{
        position: "absolute",
        top: -29 * zoom,
        width: 400 * zoom
      }}
      onLoad={(e) => {
        var svgDoc = e.currentTarget.contentDocument;
        var styleElement = svgDoc.createElementNS("http://www.w3.org/2000/svg", "style");
        styleElement.textContent = document.getElementsByTagName("style")[0].innerText; // add whatever you need here
        // svgDoc.getElementById("where-to-insert").appendChild(styleElement);
        svgDoc.getElementsByTagName("svg")[0].appendChild(styleElement);
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
