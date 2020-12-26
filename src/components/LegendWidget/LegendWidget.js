// @flow

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "semantic-ui-react";

import "semantic-ui-css/components/icon.min.css";
import styles from "./LegendWidget.module.css";

export default function LegendWidget({position, ranges, colors, showInitial}) {

	const [show, setShow] = useState(showInitial);

	const positionClassName = styles[position];

	const toggleLegend = () => {

		setShow(!show);

	};

	return (
		<div className={[styles.legendWidget, positionClassName, show ? "" : styles.hidden].join(" ")}>
			<div className={styles.icon} onClick={toggleLegend}>
				{show ? <Icon link name="sort down" /> : <Icon link name="sort up" />}
			</div>
			{show && ranges.map((item, index) => (
				<div key={index}>
					<div className={styles.legendBlock} style={{backgroundColor: colors[index]}}></div>
					<div>{item}</div>
				</div>
			)
			)}
		</div>
	);

}

LegendWidget.propTypes = {
	position: PropTypes.oneOf(["bottom-right", "bottom-left", "top-right", "top-left", "relative"]),
	ranges: PropTypes.array,
	colors: PropTypes.array,
	showInitial: PropTypes.bool
};

LegendWidget.defaultProps = {
	position: "bottom-right",
	ranges: [],
	colors: [],
	showInitial: false,
};
