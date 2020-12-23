// @flow

import React from "react";
import PropTypes from "prop-types";

import styles from "./CountWidget.module.css";

export default function CountWidget({label, count, position, locale}) {

	const positionClassName = styles[position];

	return (<div className={[styles.countWidget, positionClassName].join(" ")}>
		<div className={styles.labelStyle}>{label}</div>
		<div className={styles.countStyle}>{count.toLocaleString(locale)}</div>
	</div>);

}

CountWidget.propTypes = {
	label: PropTypes.string,
	count: PropTypes.number,
	position: PropTypes.oneOf(["bottom-right", "bottom-left", "top-right", "top-left", "relative"]),
	locale: PropTypes.string
};

CountWidget.defaultProps = {
	label: "Count",
	count: 0,
	position: "top-right",
	locale: "es-ES"
};
