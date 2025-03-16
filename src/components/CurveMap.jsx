import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-curve";
import "leaflet/dist/leaflet.css";
import { useCurrentPosition } from "../hooks/useCurrentPosition";

const CurveMap = ({ startPoint, endPoint }) => {
    var planeIcon = L.icon({
        iconUrl: 'https://www.svgrepo.com/show/49392/airplane.svg',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32] 
    });

    const controlPoint = [
        (startPoint[0] + endPoint[0]) / 2 + 1,
        (startPoint[1] + endPoint[1]) / 2,
      ];
    const currentPosition = useCurrentPosition(startPoint, controlPoint, endPoint);   
    const currentMarker = useRef(null);
    const map = useRef(null);


  useEffect(() => {
    map.current = L.map("map").setView(startPoint, 4);
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map.current);

    L.marker(startPoint).addTo(map.current).bindPopup("Start: London");
    L.marker(endPoint).addTo(map.current).bindPopup("End: Paris");

    L.curve(["M", startPoint, "Q", controlPoint, endPoint], {
      color: "blue",
      weight: 3,
      opacity: 0.7,
    }).addTo(map.current); 

    return () => {
      map.current.remove();
    };
  }, []);

  useEffect(() => {
    if (currentPosition) {
      if (currentMarker.current) {
        currentMarker.current.setLatLng(currentPosition);
      } else {
        currentMarker.current = L.marker(currentPosition, { icon: planeIcon }).addTo(map.current);
      }
    }
  }, [currentPosition]);


  return <div style={{ width: "100dvw", height: "100dvh" }} id="map"></div>;
};

export default CurveMap;
