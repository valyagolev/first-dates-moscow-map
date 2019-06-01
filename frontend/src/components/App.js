import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { texts } from "../texts.js";

var currentZoomListener = null;
// window.addEventListener('mousewheel', (e) => {
//   console.log("?", e);
//   e.preventDefault();
//   currentZoomListener && currentZoomListener(e);
// }, { passive: false });

var currentPan = null;


function zoomChange(zoom, e) {
  var newZoom = zoom - ((e.deltaY * (e.deltaMode ? 120 : 1)) > 0 ? 0.2 : -0.2) ;
  if (newZoom < 1) return 1;
  if (newZoom > 2) return 2;
  return newZoom;
}

function useWindowHeight() {
  const [height, setHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  
  return height;
}


const App = () => {
  const windowHeight = useWindowHeight();
  const mapHeight = windowHeight - 60;
  
  var [currentSelection, setCurrentSelection] = useState(null);
  if (currentSelection)
    currentSelection = texts[currentSelection.svg_id] || currentSelection;

  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    currentZoomListener = e => {
      console.log(zoomChange(zoom, e));
      setZoom(zoomChange(zoom, e));
    }
  });

  const [offset, setOffset] = useState([0, -170]);
  useEffect(() => {
    currentPan = ([dx, dy]) => {
      setOffset([
        offset[0] + dx,
        offset[1] + dy
      ]);
    };
  });

  return <div style={{
    width: 1024,
    margin: "0 auto"
}}>
    <div style={{
        width: 1024 - 35,
        margin: "5px auto",
        display: "flex",
        color: "#CC2229",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 500,
        fontSpacing: "1em",
        letterSpacing: "0.2em",
        fontSize: "16px"
    }}>
      <div style={{
        flexGrow: 5
      }}>
        КАРТА ПЕРВЫХ СВИДАНИЙ МОСКВЫ / FIRST DATES OF MOSCOW
      </div>
      <div>
        О КАРТЕ / ABOUT
      </div>
    </div>
    <div
      // onWheel={e => console.log(e)}
      style={{
        width: 1024,
        height: mapHeight,
        // border: "1px black solid",
        margin: "0 auto",
        position: "relative",
        overflow: "hidden"
      }}>

    <img
      src="/static/map_big.jpg"
      // onWheel={e => console.log(e)}
      style={{
        position: "absolute",
        left: offset[0],
        top: offset[1],
        width: 1024 * zoom
      }}/>

    <object
      id="svg-object"
      data="static/plashki.svg"
      type="image/svg+xml"
      // onWheel={e => console.log(e)}
      style={{
        position: "absolute",
        left: offset[0],
        top: -29 * zoom + offset[1],
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

        var clickStart = null;

        function pan(e) {
          currentPan([
            e.screenX - clickStart[0],
            e.screenY - clickStart[1]
          ]);

          clickStart = [e.screenX, e.screenY];
        }

        svgDoc.onpointerdown = function(e) {
          clickStart = [e.screenX, e.screenY];
          svgDoc.onpointermove = pan;
        }
        
        svgDoc.onpointerup = function(e) {
          clickStart = null;
          svgDoc.onpointermove = null;
        }

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
            height: 1024
            // height: "100%",
          }}
          onClick={e => setCurrentSelection(null)}>

          <div
          style={{
            margin: "0 auto",
            width: 555,
            height: mapHeight - 115,
            backgroundColor: "white",
            paddingBottom: 30,
            position: "relative",
            top: 45,
            overflowY: "scroll",
            overflowX: "hidden"
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
    
    </div>
  </div>;
}

// const App = () => (
//   <DataProvider endpoint="api/lead/" 
//                 render={data => <Table data={data} />} />
// );

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
