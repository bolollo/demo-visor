// @flow

import React from "react";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

import ListWidget from "./ListWidget";

const items = [
	{"ogc_fid":22, "nombre_igg":"México", "p_total":15175862},
	{"ogc_fid":28, "nombre_igg":"Distrito Federal", "p_total":8851080},
	{"ogc_fid":7, "nombre_igg":"Veracruz", "p_total":7643194}
];

describe("ListWidget component", () => {

	it("matches the snapshot ", () => {

		const component = shallow(<ListWidget></ListWidget>);
		expect(toJSON(component)).toMatchSnapshot();

	});

	it("has count equal 3", () => {

		const component = shallow(<ListWidget items={items}></ListWidget>);
		expect(component.find("li")).toHaveLength(3);

	});

	it("has position bottom-left", () => {

		const component = shallow(<ListWidget position={"bottom-left"}></ListWidget>);
		expect(component.find(".listWidget").hasClass("bottom-left")).toEqual(true);

	});

	it("Test click li", () => {

		const mockClick = jest.fn();
		const component = shallow(<ListWidget items={items} handleClick={mockClick}></ListWidget>);
		component.find("li").at(1).simulate("click");
		expect(mockClick).toHaveBeenCalled();

	});

	it("Test click selectAll", () => {

		const mockClick = jest.fn();
		const component = shallow(<ListWidget handleSelectAll={mockClick}></ListWidget>);
		component.find(".selector span").at(0).simulate("click");
		expect(mockClick).toHaveBeenCalled();

	});

	it("Test click selectNone", () => {

		const mockClick = jest.fn();
		const component = shallow(<ListWidget handleSelectNone={mockClick}></ListWidget>);
		component.find(".selector span").at(1).simulate("click");
		expect(mockClick).toHaveBeenCalled();

	});

	it("Test click selectInvert", () => {

		const mockClick = jest.fn();
		const component = shallow(<ListWidget handleSelectInvert={mockClick}></ListWidget>);
		component.find(".selector span").at(2).simulate("click");
		expect(mockClick).toHaveBeenCalled();

	});

});
