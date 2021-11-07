// Import modules
// ==============
import {Map, Overlay, Tile, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Stroke, Style, Circle as CircleStyle, Fill} from 'ol/style';
import LayerGroup from 'ol/layer/Group';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {circular} from 'ol/geom/Polygon';
import Control from 'ol/control/Control';
import Circle from 'ol/geom/Circle';
import { getKey } from 'ol/tilecoord';

// Set styling constants
// =====================
const styleTrackers = new Style({
  stroke: new Stroke({
    color: [206, 18, 21, 0.5],
    width: 4,
  }),
});

// Set map constant
// ================

const map = new Map({
  target: 'map',
  view: new View({
    center: [1300000, 7500000],
    zoom: 10 
  }),
});

// Set basemap layers constants
// ============================
const openStreetMapStandard = new TileLayer({
  source: new OSM(),
  visible: true,
  title: 'OSMStandard'
})

const openStreetMapHumanitarian = new TileLayer({
  source: new OSM({
    url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
  }),
  visible: false,
  title: 'OSMHumanitarian'
})

const stamenTerrain = new TileLayer({
  source: new Stamen({
    layer: 'terrain'
  }),
  visible: false,
  title: 'StamenTerrain'
})

const openCycleMap = new TileLayer({
  source: new OSM({
    url: 'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=0ae796088b4643a2a94a4d20f30a05b5'
  }),
  visible: false,
  title: 'OpenCycleMap'
})

const outdoors = new TileLayer({
  source: new OSM({
    url: 'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=0ae796088b4643a2a94a4d20f30a05b5'
  }),
  visible: false,
  title: 'Outdoors'
})


// Set and add basemap layer group
// ===============================
const baseLayerGroup = new LayerGroup({
  layers: [
    openStreetMapStandard, openStreetMapHumanitarian, stamenTerrain, openCycleMap, outdoors
  ]
})

map.addLayer(baseLayerGroup);

// Layer switcer logic for basemaps
// ================================
const baseLayerElements = document.querySelectorAll('.baseMapChoise');

for(let baseLayerElement of baseLayerElements){
  baseLayerElement.addEventListener("change", function() {
    let baseLayerElementValue = this.value;
    baseLayerGroup.getLayers().forEach(function(element, index, array){
      let baseLayerTitle = element.get('title');
      element.setVisible(baseLayerTitle === baseLayerElementValue);
    })
  })
}

// Set and add plan layers
// =======================
const PoI = new VectorLayer({
  source: new VectorSource({
    url: './data/PoI.geojson',
    format: new GeoJSON()
  }),
  style: new Style({
    image: new CircleStyle({
      radius: 12,
      fill: new Fill({
        color: [239, 109, 9, 0.5],
      }),
      stroke: new Stroke({
        color: [255, 255, 255, 0.5],
        width: 4
      })
    }),
  }),
  visible: true,
  title: 'PoI'
})

const Poster = new VectorLayer({
  source: new VectorSource({
    url: './data/Poster.geojson',
    format: new GeoJSON()
  }),
  style: new Style({
    image: new CircleStyle({
      radius: 12,
      fill: new Fill({
        color: [9, 9, 255, 0.5],
      }),
      stroke: new Stroke({
        color: [255, 255, 255, 0.5],
        width: 4
      })
    }),
  }),
  visible: true,
  title: 'Poster'
})

const Ruter = new VectorLayer({
  source: new VectorSource({
    url: './data/Ruter.geojson',
    format: new GeoJSON()
  }),
  style: new Style({
    stroke: new Stroke({
      color: [186, 9, 255, 0.5],
      width: 6
    }),
  }),
  visible: true,
  title: 'Ruter'
})

// Set and add plan layer group
// ============================
const planLayerGroup = new LayerGroup({
  layers: [
    Ruter, PoI, Poster
  ]
})

map.addLayer(planLayerGroup);


// Set and add tracker layers
// ==========================
function checkFileExist(urlToFile) { // function to see if the geojson file exist
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', urlToFile, false);
    xhr.send();
     
    if (xhr.status == "404") {
        return false;
    } else {
        return true;
    }
}
 
for (let i = 1; i < 4; i++) { // set i to amount of trackers minus 1
  console.log("./data/scoutcon-tracker-" + i + ".geojson");

  var result = checkFileExist("./data/scoutcon-tracker-" + i + ".geojson");

  const trackerLayer = new VectorLayer({
    source: new VectorSource({
      url: './data/scoutcon-tracker-' + i + '.geojson', // add layer
      format: new GeoJSON()
    }),
    style: styleTrackers,
    visible: true,
    title: 'trackerLayer'
  })
map.addLayer(trackerLayer);
}

// Vector features popups
const overlayContainerElement = document.querySelector('.overlay-container');
const overlaylayer = new Overlay({
  element: overlayContainerElement
})
map.addOverlay(overlaylayer);

const overlayFeatuerPostnavn = document.getElementById('feature-postnavn');
const overlayFeatuerPoINavn = document.getElementById('feature-poinavn');
const overlayFeatuerRuteNavn = document.getElementById('feature-rutenavn');
const overlayFeatuerPatruljer = document.getElementById('feature-patruljer');
const overlayFeatuerPatruljeNavn = document.getElementById('feature-patruljenavn');
const overlayFeauterTrackerID = document.getElementById('feature-trackerid');

map.on('click', function(e){
  overlaylayer.setPosition(undefined); // clear setuposition, so that we can exit popup if no features are selected
  map.forEachFeatureAtPixel(e.pixel, function(feature, layer){

    // clear content for all containers
    overlayFeatuerPostnavn.innerHTML = '';
    overlayFeatuerPoINavn.innerHTML = '';
    overlayFeatuerRuteNavn.innerHTML = '';
    overlayFeatuerPatruljer.innerHTML = '';
    overlayFeatuerPatruljeNavn.innerHTML = '';
    overlayFeauterTrackerID.innerHTML = '';

    // catch feature values
    let clickedCoordinate = e.coordinate;
    let clickedFeaturePostnavn = feature.get('Postnavn');
    let clickedFeaturePoINavn = feature.get('PoI Navn');
    let clickedFeatureRuteNavn = feature.get('Rutenavn');
    let clickedFeaturePatruljer = feature.get('Patruljer');
    let clickedFeaturePatruljeNavn = feature.get('Patruljenavn');
    let clickedFeatureTrackerID = feature.get('TrackerID');

    overlaylayer.setPosition(clickedCoordinate);

    // reload containers if they have a relevant value
   if (typeof clickedFeaturePostnavn === 'undefined') {
    } else {
      overlayFeatuerPostnavn.innerHTML = 'Post: ' + clickedFeaturePostnavn;
    }    

    if (typeof clickedFeaturePoINavn === 'undefined') {
    } else {
      overlayFeatuerPoINavn.innerHTML = 'PoI: ' + clickedFeaturePoINavn;
    }  
    
    if (typeof clickedFeatureRuteNavn === 'undefined') {
    } else {
 
      overlayFeatuerRuteNavn.innerHTML = 'Rute: ' + clickedFeatureRuteNavn;
    }  

    if (typeof clickedFeaturePatruljer === 'undefined') {
    } else {
      overlayFeatuerPatruljer.innerHTML = '(Patruljer: ' + clickedFeaturePatruljer + ')';
    } 

    if (typeof clickedFeaturePatruljeNavn === 'undefined') {
    } else {
      overlayFeatuerPatruljeNavn.innerHTML = 'Patrulje: ' + clickedFeaturePatruljeNavn;
    }  

    if (typeof clickedFeatureTrackerID === 'undefined') {
    } else {
      overlayFeauterTrackerID.innerHTML = '(Tracker: ' + clickedFeatureTrackerID + ')';
    }  
  })
})

// // Add users geolocation
// // =====================
// const userSource = new VectorSource();
// const userLayer = new VectorLayer({
//   source: userSource,
// });

// map.addLayer(userLayer);

// // get location from browser
// navigator.geolocation.watchPosition(
//   function (pos) {
//     const coords = [pos.coords.longitude, pos.coords.latitude];
//     const accuracy = circular(coords, pos.coords.accuracy);
//     userSource.clear(true);
//     userSource.addFeatures([
//       new Feature(
//         accuracy.transform('EPSG:4326', map.getView().getProjection())
//       ),
//       new Feature(new Point(fromLonLat(coords))),
//     ]);
//   },
//   function (error) {
//     alert(`ERROR: ${error.message}`);
//   },
//   {
//     enableHighAccuracy: true,
//   }
// );

// const locate = document.createElement('div');
// locate.className = 'ol-control ol-unselectable locate';
// locate.innerHTML = '<button title="Locate me">◎</button>';
// locate.addEventListener('click', function () {
//   if (!userSource.isEmpty()) {
//     map.getView().fit(userSource.getExtent(), {
//       maxZoom: 18,
//       duration: 500,
//     });
//   }
// });
// map.addControl(
//   new Control({
//     element: locate,
//   })
// );