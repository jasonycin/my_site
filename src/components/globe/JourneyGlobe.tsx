import Globe from 'react-globe.gl';
import React, {useEffect, useRef, useState} from 'react';
import type {GlobeInstance} from "globe.gl";
import * as THREE from "three";
import { DUDELDORF_WILLIAMSBURG_ARC } from "@components/globe/Arc.ts";

type CountryFeature = {
    type: "Feature";
    properties: Record<string, any>;
    geometry: {
        type: "Polygon" | "MultiPolygon";
        coordinates: number[][][] | number[][][][];
    };
};


export default function JourneyGlobe() {
    const globeRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [size, setSize] = useState({
        width: 800,
        height: 520,
    });

    const [countries, setCountries] = useState<CountryFeature[]>([]);
    const [USTerritories, setUSTerritories] = useState<CountryFeature[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            const height = Math.min(width * 0.68, 560);

            setSize({
                width,
                height,
            });
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        fetch('/globe/countries_lowres.geojson')
            .then(res => res.json())
            .then((geojson) => {
                setCountries(geojson.features);
            })

        fetch('/globe/us-states.json')
            .then(res => res.json())
            .then((geojson) => {
                setUSTerritories(geojson.features);
            })
    }, []);

    useEffect(() => {
        const globe: GlobeInstance = globeRef.current;
        if (!globe) return;

        // Make the Three.js renderer transparent.
        const renderer = globe.renderer();
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.domElement.style.background = 'transparent';

        // Camera positioning.
        globe.pointOfView(
            {
                lat: 35,
                lng: -45,
                altitude: 2.4,
            },
            0
        );

        // auto-rotate, but gently
        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.35;
        controls.enableZoom = false;
    }, []);

    const sideMatRef = useRef(
        new THREE.MeshBasicMaterial({
            // If you want a yellow fill:
            color: new THREE.Color('#ffea00'),
            transparent: true,
            opacity: 1,
            // push the polygon surface slightly back so the stroke can render on top
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
            depthWrite: true
        })
    );

    const capMatRef = useRef(
        new THREE.MeshBasicMaterial({
            color: new THREE.Color('rgba(0,0,0,0.02)'),
            transparent: true,
            opacity: 0.02,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1,
            depthWrite: true
        })
    );

    return(
        <div
            ref={containerRef}
            className="relative flex w-full items-center justify-center overflow-hidden"
            style={{
                height: size.height,
                background: 'transparent',
            }}
        >
            <Globe
                ref={globeRef}
                width={size.width}
                height={size.height}
                globeImageUrl="/globe/blue_marble.jpg"
                arcsData={[DUDELDORF_WILLIAMSBURG_ARC]}
                arcLabel={() => "Germany → Williamsburg"}
                arcColor={"color"}
                arcStroke={1}
                arcDashLength={0.4}
                arcDashGap={1}
                arcDashAnimateTime={5000}
                showGlobe={false}
                showAtmosphere={false}
                backgroundColor="rgba(0,0,0,0)"
                polygonsData={[countries, USTerritories].flat()}
                polygonCapColor={() => "rgba(0, 0, 0, 0.02)"}
                polygonSideColor={() => "rgba(0, 0, 0, 0.00)"}
                polygonStrokeColor={() => "rgba(0, 0, 0, 0.95)"}
                polygonAltitude={0.0}
            />
        </div>
    );
}
