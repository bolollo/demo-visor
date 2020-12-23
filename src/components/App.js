// @flow

import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "./App.module.css";
import { Header, Footer } from "@geostarters/react-components";
import IMAGES from "../resources/images";

import DeckGL from "@deck.gl/react";
import {MVTLayer} from "@deck.gl/geo-layers";
import {StaticMap} from "react-map-gl";

import {MapboxLayer} from "@deck.gl/mapbox";

import CountWidget from "./CountWidget/CountWidget";
import ListWidget from "./ListWidget/ListWidget";

const INITIAL_VIEW_STATE = {
	longitude: -102.32,
	latitude: 23.89,
	zoom: 4.5
};

function App() {

	const [glContext, setGLContext] = useState();
	const [selected, setSelected] = useState([]);
	const [listEstados, setListEstados] = useState([]);
	const [totalPopulation, setTotalPopulation] = useState(0);
	const deckRef = useRef(null);
	const mapRef = useRef(null);

	const onMapLoad = useCallback(() => {

		const map = mapRef.current.getMap();
		const deck = deckRef.current.deck;

		console.log(map);

		// You must initialize an empty deck.gl layer to prevent flashing
		map.addLayer(
			// This id has to match the id of the deck.gl layer
			new MapboxLayer({ id: "tierra-mexico", deck }),
			// Optionally define id from Mapbox layer stack under which to add deck layer
			"waterway-name"
		);

	}, []);

	const updateSelectedEstados = (id, population) => {

		const isSelected = selected.find(item => item.id === id);

		if (isSelected) {

			setSelected(selected.filter(item => item.id !== id));

		} else {

			setSelected([...selected, {id, population}]);

		}

	};

	const updateTotalPopulation = (selected) => {

		setTotalPopulation(selected.reduce((total, current) => total + current.population, 0));

	};
	useEffect(() => {

		updateTotalPopulation(selected);

	}, [selected]);


	async function fetchEstados() {

		const response = await fetch("https://demo-tierra.herokuapp.com/api/estados");
		const json = await response.json();
		setListEstados(json);

	}

	useEffect(() => {

		fetchEstados();

	}, []);


	const onMapClick = (info) => {

		if (info.object) {

			updateSelectedEstados(info.object.properties.ogc_fid, info.object.properties.p_total);

		}

	};

	const handleListClick = (item) => {

		updateSelectedEstados(item.ogc_fid, item.p_total);

	};

	const isSelected = f => selected.find(sel => sel.id === f.properties.ogc_fid);

	const layers = [
		new MVTLayer({
			id: "tierra-mexico",
			data: "https://demo-tierra.herokuapp.com/api/{z}/{x}/{y}.pbf",
			minZoom: 0,
			maxZoom: 16,
			pickable: true,
			uniqueIdProperty: "ogc_fid",
			autoHighlight: true,
			getLineColor: f => (isSelected(f) ? [52, 51, 50] : [84, 82, 81]),
			lineWidthUnits: "pixels",
			getLineWidth: f => (isSelected(f) ? 2 : 1),
			lineWidthMinPixels: 1,
			getFillColor: (f) => {

				const opacity = isSelected(f) ? 255 : 220;

				switch (true) {

				case (f.properties.p_total < 1500000):
					return [165, 219, 194, opacity];
				case (f.properties.p_total < 2500000):
					return [123, 188, 176, opacity];
				case (f.properties.p_total < 4000000):
					return [85, 156, 158, opacity];
				case (f.properties.p_total < 6000000):
					return [58, 124, 137, opacity];
				case (f.properties.p_total < 10000000):
					return [35, 93, 114, opacity];
				default:
					return [18, 63, 90, opacity];

				}

			},
			updateTriggers: {
				getLineWidth: selected,
				getLineColor: selected,
				getFillColor: selected
			}

		})
	];

	return (
		<div className={styles.App}>

			<div className={styles.header}>
				<Header title="Demo visor" pathLogo={IMAGES.LOGO_TIERRA} customStyleBar={{backgroundColor: "var(--primary-color)", color: "var(--primary-white)"}} showRightElements={true}></Header>
			</div>

			<div className={styles.AppBody}>
				<div className={styles.containerMap}>
					<DeckGL
						ref={deckRef}
						layers={layers}
						initialViewState={INITIAL_VIEW_STATE}
						controller={true}
						onWebGLInitialized={setGLContext}
						onClick={onMapClick}
						glOptions={{
							/* To render vector tile polygons correctly */
							stencil: true
						}}
					>
						{glContext && (
						/* This is important: Mapbox must be instantiated after the WebGLContext is available */
							<StaticMap
								ref={mapRef}
								gl={glContext}
								mapStyle="https://geoserveis.icgc.cat/contextmaps/fulldark.json"
								mapboxApiAccessToken={""}
								onLoad={onMapLoad}
							/>
						)}
					</DeckGL>
					<CountWidget count={totalPopulation} label={"Total Pupulation"}></CountWidget>
					<ListWidget items={listEstados} handleClick={handleListClick} selected={selected}></ListWidget>
				</div>
			</div>

			<Footer title="by @bolollo" customStyleBar={{position: "relative", marginTop: 0}}></Footer>

		</div>
	);

}

export default App;
