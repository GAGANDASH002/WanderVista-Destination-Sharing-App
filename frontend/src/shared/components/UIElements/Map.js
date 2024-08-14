import React, { useRef, useEffect } from 'react';
import 'ol/ol.css';
import { Map as OlMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

import './Map.css';

const Map = props => {
  const mapRef = useRef();
  const { center, zoom } = props;
  const mapInstance = useRef(null);
  const markerRef = useRef();

  useEffect(() => {
    // If there's an existing map instance, set its target to null before creating a new one
    if (mapInstance.current) {
      mapInstance.current.setTarget(null);
    }

    // Create a new map instance and store it in the mapInstance ref
    mapInstance.current = new OlMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([center.lng, center.lat]),
        zoom: zoom,
      }),
    });

    // Create a marker element
    const marker = document.createElement('div');
    marker.className = 'marker';
    markerRef.current = new Overlay({
      position: fromLonLat([center.lng, center.lat]),
      positioning: 'center-center',
      element: marker,
      stopEvent: false,
    });

    // Add the marker overlay to the map
    mapInstance.current.addOverlay(markerRef.current);

    // Cleanup function to remove the map instance
    return () => {
      mapInstance.current.setTarget(null);
    };
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
      id="map"
    >
    </div>
  );
};

export default Map;
