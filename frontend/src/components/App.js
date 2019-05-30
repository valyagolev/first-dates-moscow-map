import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  const zoom = 2;
  return <div
      style={{
        position: "relative"
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
      }}>
      
    </object>
     

  </div>;
}

// const App = () => (
//   <DataProvider endpoint="api/lead/" 
//                 render={data => <Table data={data} />} />
// );

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
