// @flow

import React, { Component } from "react";
import styles from "./App.module.css";
import { Map, LogoICGC, Header, Footer } from "@geostarters/react-components";
import IMAGES from "../resources/images";

class App extends Component {

	render() {

		/**/

		return (
			<div className={styles.App}>

				<div className={styles.header}>
					<Header title="Map Template" pathLogo={IMAGES.GENCAT_white} logoSize="medium" customStyleBar={{backgroundColor: "var(--primary-color)", color: "var(--primary-white)"}} showRightElements={true} customStyleLogo={{maxWidth: "15em"}}>
						<div className={styles.flexRow}>
							<div className={styles.logoText}>ICGC</div>
							<LogoICGC position="top-right"/>
						</div>
					</Header>
				</div>

				<div className={styles.AppBody}>
					<div className={styles.containerMap}>
						<Map showAttribution={false}></Map>
					</div>
				</div>

				<Footer title="by @geostarters" customStyleBar={{position: "relative", marginTop: 0}}></Footer>

			</div>
		);

	}

}

export default App;
