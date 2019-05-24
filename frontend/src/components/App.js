import React from "react";
import ReactDOM from "react-dom";

import DeckGL from '@deck.gl/react';
import {Deck, MapView} from '@deck.gl/core';
import {LineLayer, BitmapLayer} from '@deck.gl/layers';

// Viewport settings
const initialViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
};

// Data to be used by the LineLayer
const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}];

// DeckGL react component
class App extends React.Component {
  render() {
    const layers = [
        new BitmapLayer({
            id: 'bitmap-layer',
            bounds: [-122.5190, 37.7045, -122.355, 37.829],
            image: '/static/map_big.jpg'
          }),
        new LineLayer({id: 'line-layer', data})
    ];

    return (
        <DeckGL
            initialViewState={initialViewState}
            controller={true}
            layers={layers}>
                {/* <MapView width="50%" x="50%" fovy={50} /> */}
        </DeckGL>
    );
  }
}

// import DataProvider from "./DataProvider";
// import Table from "./Table";

// const App = () => (
//   <DataProvider endpoint="api/lead/" 
//                 render={data => <Table data={data} />} />
// );

const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;
