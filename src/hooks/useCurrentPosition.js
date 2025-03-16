import { useEffect, useState } from "react";
import * as turf from "@turf/turf";

export function useCurrentPosition(startPoint, controlPoint, endPoint) {
    const [currentPosition, setCurrentPosition] = useState();

    useEffect(() => {
        setInterval(() => {
        // Function to compute a point on a quadratic Bezier curve
        function getQuadraticBezierPoint(t, p0, p1, p2) {
            const x = (1 - t) ** 2 * p0.lng + 2 * (1 - t) * t * p1.lng + t ** 2 * p2.lng;
            const y = (1 - t) ** 2 * p0.lat + 2 * (1 - t) * t * p1.lat + t ** 2 * p2.lat;
            return [x, y]; // Turf expects [lng, lat]
        }
        
        const points = [];
        const numPoints = 100;
        
        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            points.push(getQuadraticBezierPoint(t, {lat: startPoint[0], lng: startPoint[1]}, {lat: controlPoint[0], lng: controlPoint[1]}, {lat: endPoint[0], lng: endPoint[1]}));
        }
        
        const turfLine = turf.lineString(points);
        
        const lineLength = turf.length(turfLine, {units: "kilometers"});
    
        const flightTime = ((lineLength / 800).toFixed(2) * 60) + 30;
    
        const elapsedTime = Math.floor((new Date - new Date(Number(localStorage.getItem("startTimestamp")))) /60000);
    
        const currentPoint = turf.along(turfLine, lineLength * (elapsedTime/flightTime));
    
        setCurrentPosition([currentPoint.geometry.coordinates[1], currentPoint.geometry.coordinates[0]]);
    
        }, 5000);
    }, []);

    return currentPosition;
}