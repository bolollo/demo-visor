// @flow

import React from "react";
import PropTypes from "prop-types";

import styles from "./ListWidget.module.css";

export default function ListWidget({items, selected, position, handleClick, locale, handleSelectInvert, handleSelectNone, handleSelectAll}) {

	const positionClassName = styles[position];

	function isSelected (item) {

		return selected.find(sel => item.ogc_fid === sel.id);

	}

	return (
		<div className={[styles.listWidget, positionClassName].join(" ")}>
			<div className={styles.selector}>
				<span onClick={handleSelectAll}>ALL</span><span onClick={handleSelectNone}>NONE</span><span onClick={handleSelectInvert}>INVERT</span>
			</div>
			<ul>
				{items.map(item => (
					<li key={item.ogc_fid} onClick={handleClick.bind(this, item)} className={isSelected(item) ? styles.selected : null}>
						{item.nombre_igg} <span className={styles.small}>({item.p_total.toLocaleString(locale)})</span>
					</li>
				))}
			</ul>
		</div>
	);

}

ListWidget.propTypes = {
	items: PropTypes.array,
	selected: PropTypes.array,
	position: PropTypes.oneOf(["bottom-right", "bottom-left", "top-right", "top-left", "relative"]),
	handleClick: PropTypes.func,
	locale: PropTypes.string,
	handleSelectInvert: PropTypes.func,
	handleSelectNone: PropTypes.func,
	handleSelectAll: PropTypes.func
};

ListWidget.defaultProps = {
	items: [],
	selected: [],
	position: "top-left",
	handleClick: () => {},
	locale: "es-ES",
	handleSelectInvert: () => {},
	handleSelectNone: () => {},
	handleSelectAll: () => {}
};
