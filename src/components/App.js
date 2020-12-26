// @flow

import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "./App.module.css";
import { Header, Footer } from "@geostarters/react-components";
import IMAGES from "../resources/images";

import DeckGL from "@deck.gl/react";

import {MVTLayer} from "@deck.gl/geo-layers";
import {StaticMap} from "react-map-gl";
import Geostats from "geostats";
import cartocolor from "cartocolor";
import color from "color";

import {MapboxLayer} from "@deck.gl/mapbox";

import CountWidget from "./CountWidget/CountWidget";
import ListWidget from "./ListWidget/ListWidget";
import LegendWidget from "./LegendWidget/LegendWidget";

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
	const [populationSerie, setPopulationSerie] = useState();
	const [ranges, setRanges] = useState([]);
	const [colors, setColors] = useState([]);

	const onMapLoad = useCallback(() => {

		const map = mapRef.current.getMap();
		const deck = deckRef.current.deck;

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


	useEffect(() => {

		if (populationSerie) {

			setRanges(populationSerie.ranges);
			setColors(populationSerie.colors);

		}

	}, [populationSerie]);

	async function fetchEstados() {

		const response = await fetch("https://demo-tierra.herokuapp.com/api/estados");
		const json = await response.json();
		setListEstados(json);
		const populationData = json.map(item => item.p_total);
		const dataSerie = new Geostats();
		dataSerie.setSerie(populationData);
		dataSerie.setColors(cartocolor.PurpOr["6"]);
		dataSerie.getClassJenks(6);
		setPopulationSerie(dataSerie);

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

	const handleSelectInvert = () => {

		const invertSelectedFilter = listEstados.filter(item => !selected.find(item1 => item1.id === item.ogc_fid));
		const invertSelected = invertSelectedFilter.map(item => ({id: item.ogc_fid, population: item.p_total}));
		setSelected(invertSelected);

	};

	const handleSelectNone = () => {

		setSelected([]);

	};

	const handleSelectAll = () => {

		const allSelected = listEstados.map(item => ({id: item.ogc_fid, population: item.p_total}));
		setSelected(allSelected);

	};

	const isSelected = f => selected.find(sel => sel.id === f.properties.ogc_fid);

	const getColor = (f) => {

		const colorC = color(populationSerie.colors[populationSerie.getRangeNum(f.properties.p_total)]);

		const opacity = isSelected(f) ? 255 : 220;

		return [...colorC.rgb().array(), opacity];

	};

	const layers = [
		new MVTLayer({
			id: "tierra-mexico",
			data: "https://demo-tierra.herokuapp.com/api/{z}/{x}/{y}.pbf",
			minZoom: 0,
			maxZoom: 16,
			pickable: true,
			uniqueIdProperty: "ogc_fid",
			autoHighlight: true,
			loadOptions: {mvt: {
				layers: ["estados"]
			}},
			getLineColor: f => (isSelected(f) ? [52, 51, 50] : [84, 82, 81]),
			lineWidthUnits: "pixels",
			getLineWidth: f => (isSelected(f) ? 2 : 1),
			lineWidthMinPixels: 1,
			getFillColor: getColor,
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
					<ListWidget
						items={listEstados}
						handleClick={handleListClick}
						selected={selected}
						handleSelectAll={handleSelectAll}
						handleSelectNone={handleSelectNone}
						handleSelectInvert={handleSelectInvert}>
					</ListWidget>
					<LegendWidget ranges={ranges} colors={colors}></LegendWidget>
				</div>
			</div>

			<Footer title="by @bolollo" customStyleBar={{position: "relative", marginTop: 0}}></Footer>

		</div>
	);

}

export default App;
