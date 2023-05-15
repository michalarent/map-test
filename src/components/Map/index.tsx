//@ts-nocheck

import {MapContainer, TileLayer, GeoJSON, Tooltip} from 'react-leaflet';


import countries from "./custom.geo.50.json";
import {useState} from "react";

const dataScopes = [
    {
        name: "Population",
        key: "pop_est",
        description: "The population of the country",
        unit: "",
        scale: [0, 5000000, 10000000, 25000000, 50000000, 75000000, 100000000, 200000000, 1000000000, 8000000000]
    },
    {
        name: "GDP",
        key: "gdp_md_est",
        description: "The GDP of the country",
        unit: "USD",
        scale: [0, 10000, 50000, 100000, 500000, 1000000, 5000000, 1000000000]
    }
];

// from small to big, 15 colors https://colordesigner.io/gradient-generator
const colors = [
    '#fffddd',
    '#faf3c8',
    '#f6e8b3',
    '#f4dd9f',
    '#f3d18b',
    '#f2c578',
    '#f2b866',
    '#f2ab55',
    '#f39d46',
    '#f38e38',
    '#f47d2c',
    '#f56b23',
    '#f6571d',
    '#f63c1a',
    '#f6081b'
]

function Map() {
    const [dataScope, setDataScope] = useState(dataScopes[0]); // dataScopes[1
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const position = [51.505, -0.09];

    const highlightFeature = (e) => {
        let layer = e.target;
        setHoveredCountry(layer.feature.properties);
    }

    const resetHighlight = (e) => {
        setHoveredCountry(null);
    }

    const onEachFeature = (feature, layer) => {

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: () => setSelectedCountry(feature.properties)
        });
    }

    const getColor = (val) => {
        for (let i = 1; i < dataScope.scale.length; i++) {
            if (val < dataScope.scale[i]) {
                return colors[i - 1];
            }
        }

        return colors[colors.length - 1];
    }

    const style = (feature) => {
        let mapStyle = {
            fillColor: getColor(feature.properties[dataScope.key]),
            weight: 1,
            opacity: 1,
            color: '#aeaeae',
            dashArray: '3',
            fillOpacity: 0.7
        };

        if (hoveredCountry && feature.properties.iso_a3 === hoveredCountry.iso_a3) {
            mapStyle.color = '#aeaede';
            mapStyle.weight = 2;
        }

        if (selectedCountry && feature.properties.iso_a3 === selectedCountry.iso_a3) {
            mapStyle.color = '#aeaeff';
            mapStyle.weight = 2;
        }

        return mapStyle;
    }


    return <div className="">
        <div className="h-screen w-screen bg-neutral-900 relative z-10">
            <MapContainer zoom={2} center={[0, 0]} style={{width: '100%', height: '100%'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/%7Bz%7D/%7Bx%7D/%7By%7D.png"
                />
                <GeoJSON data={countries as any} onEachFeature={onEachFeature} style={style}>
                    <Tooltip sticky>
                        {hoveredCountry && hoveredCountry.admin}
                    </Tooltip>
                </GeoJSON>
                <Tooltip sticky>sticky Tooltip for Polygon</Tooltip>
            </MapContainer>
            {selectedCountry &&
                <div
                    className={"absolute z-[100000] right-2 top-2 w-[400px] h-[400px] bg-gray-500/80 backdrop-blur rounded text-2xl font-bold p-8 text-black"}>
                    <div>Selected country:</div>
                    <br/>
                    {selectedCountry.admin}
                </div>}
        </div>
    </div>
}

export default Map;

