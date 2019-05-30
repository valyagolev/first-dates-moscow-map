import React from "react";
import ReactDOM from "react-dom";

import DeckGL from '@deck.gl/react';
import {Deck, MapView, OrthographicView} from '@deck.gl/core';
import {COORDINATE_SYSTEM} from '@deck.gl/core';

import {PolygonLayer, BitmapLayer, LineLayer, ScatterplotLayer} from '@deck.gl/layers';

// Viewport settings
const initialViewState = {
  longitude: 0,
  latitude: 0,
  zoom: -3,
  // pitch: 0,
  // bearing: 0
};

// Data to be used by the LineLayer
// const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}];

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      scale: 1,
      // 100 points with random position in [-1, 1]
      data: Array.from(Array(100)).map(_ => ({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1
      }))
    };

    this._resize = this._resize.bind(this);
    this._update = this._update.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
    window.requestAnimationFrame(this._update);
  }

  _resize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _update() {
    const newScale = this.state.scale * 0.995;
    this.setState({
      scale: newScale < 0.25 ? 0.75 : newScale
    });
    window.requestAnimationFrame(this._update);
  }

  _renderPoints() {
    const {width, height, data, scale} = this.state;
    if (!data || data.length === 0) {
      return null;
    }

    return new ScatterplotLayer({
      id: 'points',
      data,
      radiusScale: 10,
      getPosition: ({x, y}) => [((x * width) / 2) * scale, ((y * height) / 2) * scale],
      coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getSourcePosition: {scale},
        getTargetPosition: {scale}
      }
    });
  }

  _renderBBox() {
    const {width, height, scale} = this.state;

    // add padding to reveal the bbox, it should stay still relative to the canvas bbox
    const PADDING = 10;
    const left = (-width / 2 + PADDING) * scale;
    const right = (width / 2 - PADDING) * scale;
    const top = (-height / 2 + PADDING) * scale;
    const bottom = (height / 2 - PADDING) * scale;

    return new LineLayer({
      id: 'bbox',
      data: [
        // bbox
        {source: [left, top], target: [right, top]},
        {source: [left, top], target: [left, bottom]},
        {source: [right, top], target: [right, bottom]},
        {source: [left, bottom], target: [right, bottom]},
        // origin
        {source: [-25 * scale, 0], target: [25 * scale, 0]},
        {source: [0, -25 * scale], target: [0, 25 * scale]}
      ],
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getSourcePosition: {scale},
        getTargetPosition: {scale}
      }
    });
  }

  _renderMap() {
    return new BitmapLayer({
      id: 'bitmap-layer',
      coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
      // bounds: [-122.5190, 37.7045, -122.355, 37.829],
      bounds: [0, 8231, 7016, 0],
      image: '/static/map_big.jpg',
      // updateTriggers: {
      //   getSourcePosition: {scale},
      //   getTargetPosition: {scale}
      // }
    });
  }

  _renderDatesImage() {
    return new BitmapLayer({
      id: 'bitmap-layer-plashki',
      coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
      // bounds: [-122.5190, 37.7045, -122.355, 37.829],
      bounds: [0, 8231, 7016, 0],
      image: '/static/plashki.png',
      // updateTriggers: {
      //   getSourcePosition: {scale},
      //   getTargetPosition: {scale}
      // }
    });
  }

  _renderDates() {
    return new PolygonLayer({
        id: 'polygon-layer',
        coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
        data: [{
          name: "a",
          contour: [
            [238.7010040283203,383.8689880371094],
            [220.10800170898438,413.6239929199219],

            // [-122.41669, 37.7853],
            // [-122.41669, 37.781],

            [306.5429992675781,413.6239929199219],
            [325.135986328125,383.8689880371094]
          ]
        }],
        opacity: 0,
        pickable: true,
        stroked: false,
        filled: true,
        wireframe: true,
        lineWidthMinPixels: 1,
        getPolygon: d => d.contour.map(([x, y]) => [x * 4.16666666667, y * 3.45689278635]),
        getElevation: d => 1,
        getFillColor: d => [255, 20, 20],
        getLineColor: [80, 80, 80],
        getLineWidth: 1,
        onClick: (info, event) => {
          console.log("hi");
        },
        onHover: ({object, x, y}) => {
          // const tooltip = `${object.name}\nb`;
          /* Update tooltip
              http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
          */
        }
      })
  }

  render() {
    const {width, height, scale} = this.state;
    if (width <= 0 || height <= 0) {
      return null;
    }

    return <DeckGL 
        views={[
            new OrthographicView({
                id: 'v1',
                width: '100%',
                controller: {
                    dragRotate: false,
                    dragPan: true
                }
            }),
            // new OrthographicView({
            //     id: 'v2',
            //     width: '50%',
            //     x: '50%',
            //     controller: {
            //         dragRotate: false,
            //         dragPan: true
            //     }
            // })
            // })
        ]} 
        layers={[
                  // this._renderBBox(),
                  // this._renderPoints(),
                  this._renderMap(),
                  this._renderDatesImage(),
                  this._renderDates()
                ]}
        initialViewState={initialViewState}
        // viewState={viewState}
        // onViewStateChange={e => console.log(e.viewState)/*setViewState(e.viewState)*/}
    />

    // return (
    //   <div>
    //     <DeckGL
    //       width={width}
    //       height={height}
    //       // views={view}
    //       // initialViewState={initialViewState}
    //       layers={[
    //         this._renderBBox(),
    //         this._renderPoints(),
    //         this._renderMap()
    //       ]}
    //     >
    //       <OrthographicView
    //         width={width}
    //         height={height}
    //         // the size of canvas and viewport are no longer the same as we scale w/ an ortho-viewport
    //         // all four are needed - left top right bottom - to decide the viewport size
    //         left={(-width / 2) * scale}
    //         top={(-height / 2) * scale}
    //         right={(width / 2) * scale}
    //         bottom={(height / 2) * scale}
    //       />
    //     </DeckGL>
    //   </div>
    // );
  }
}

// DeckGL react component
class App extends React.Component {
  render() {
    const layers = [
        new BitmapLayer({
            id: 'bitmap-layer',
            coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
            // bounds: [-122.5190, 37.7045, -122.355, 37.829],
            bounds: [-20, 200, 300, -20],
            image: '/static/map_big.jpg'
          }),

        // new PolygonLayer({
        //   id: 'polygon-layer',
        //   coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
        //   data: [{
        //     name: "a",
        //     contour: [
        //       // [238.7010040283203,383.8689880371094],
        //       // [220.10800170898438,413.6239929199219],

        //       [-122.41669, 37.7853],
        //       [-122.41669, 37.781],

        //       [306.5429992675781,413.6239929199219],
        //       [325.135986328125,383.8689880371094]
        //     ]
        //   }],
        //   pickable: true,
        //   stroked: true,
        //   filled: true,
        //   wireframe: true,
        //   lineWidthMinPixels: 1,
        //   getPolygon: d => d.contour,// .map(([x, y]) => [x / 100 - 122.5190, y / 100 + 37.7045]),
        //   getElevation: d => 1,
        //   getFillColor: d => [255, 20, 20],
        //   getLineColor: [80, 80, 80],
        //   getLineWidth: 1,
        //   onHover: ({object, x, y}) => {
        //     const tooltip = `${object.name}\nb`;
        //     /* Update tooltip
        //         http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
        //     */
        //   }
        // })
    ];

    const width = 300;
    const height = 400;
    const scale = 1;

    const view = new OrthographicView({
      width,
      height,
      // the size of canvas and viewport are no longer the same as we scale w/ an ortho-viewport
      // all four are needed - left top right bottom - to decide the viewport size
      left: (-width / 2) * scale,
      top: (-height / 2) * scale,
      right: (width / 2) * scale,
      bottom: (height / 2) * scale
    });

    return (
      <div>
        <Root />
        {/* <DeckGL
            initialViewState={initialViewState}
            controller={true}
            width={300}
            height={300}
            view={view}
            layers={layers}>
                {/* <OrthographicView 
                  width={300}
                  height={300}
                  left={10}
                  right={20}
                  top={30}
                  bottom={40}
                  /> *
        </DeckGL> */}
        {/* <object id="svg-object" data="static/plashki.svg" type="image/svg+xml"></object> */}
      </div>
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
