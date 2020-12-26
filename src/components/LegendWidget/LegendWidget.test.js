// @flow

import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import LegendWidget from "./LegendWidget";

const ranges = [
	"1 - 2",
	"3 - 4",
	"4 - 5"
];

const colors = [
	"#ff0000",
	"#00ff00",
	"#0000ff"
];

describe("LegendWidget component", () => {

	it("matches the snapshot ", () => {

		const component = shallow(<LegendWidget></LegendWidget>);
		expect(toJSON(component)).toMatchSnapshot();

	});

	it("showInitial has 3 div", () => {

		const component = shallow(<LegendWidget showInitial={true} ranges={ranges} colors={colors}></LegendWidget>);
		expect(component.find(".legendBlock")).toHaveLength(3);

	});

	it("has position bottom-left", () => {

		const component = shallow(<LegendWidget position={"bottom-left"}></LegendWidget>);
		expect(component.find(".legendWidget").hasClass("bottom-left")).toEqual(true);

	});

});
