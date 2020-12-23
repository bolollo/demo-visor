// @flow

import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import CountWidget from "./CountWidget";

describe("CountWidget component", () => {

	it("matches the snapshot ", () => {

		const component = shallow(<CountWidget></CountWidget>);
		expect(toJSON(component)).toMatchSnapshot();

	});

	it("has count equal 3", () => {

		const component = shallow(<CountWidget count={3}></CountWidget>);
		expect(component.find(".countStyle").text()).toEqual("3");

	});

	it("has count locale en-US text to be 3,000,000", () => {

		const component = shallow(<CountWidget count={3000000} locale={"en-US"}></CountWidget>);
		expect(component.find(".countStyle").text()).toEqual("3,000,000");

	});

	it("has label equal Total", () => {

		const component = shallow(<CountWidget label={"Total"}></CountWidget>);
		expect(component.find(".labelStyle").text()).toEqual("Total");

	});

	it("has position bottom-left", () => {

		const component = shallow(<CountWidget position={"bottom-left"}></CountWidget>);
		expect(component.find(".countWidget").hasClass("bottom-left")).toEqual(true);

	});

});
