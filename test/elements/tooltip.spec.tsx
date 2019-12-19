import * as React from "react";
import { configure, mount, ReactWrapper } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import { Tooltip, TooltipState, TooltipProps } from "../../src/elements/tooltip";

configure({ adapter: new Adapter() });

describe("tooltip", () => {
    let queryCommandValue: jest.Mock<string>;
    let component: ReactWrapper<TooltipProps, TooltipState, Tooltip>;

    beforeEach(() => {
        // Jest does not support document.queryCommandValue, so we have to mock it
        // eslint-disable-next-line
        queryCommandValue = jest.fn((commandId) => "True");
        document.queryCommandValue = queryCommandValue;

        component = mount(<Tooltip position={{ bottom: 0, top: 0, left: 0, right: 0, height: 10, width: 40 }} />);
        component.setState({ tooltipWidth: 40, tooltipHeight: 20 });
    });

    it("should render at the center point of the given position", () => {
        expect(component.state("left")).toBe(0);
        expect(component.state("top")).toBe(-20);
        expect(component.find("div.tooltip").props().style).toStrictEqual({ left: 0, top: -20 });
    });

    it("should rerender when the position prop changes", () => {
        expect(component.state("left")).toBe(0);
        expect(component.state("top")).toBe(-20);

        component.setProps({ position: { bottom: 0, top: 10, left: -20, right: 0, height: 10, width: 40 } });
        expect(component.state("left")).toBe(-20);
        expect(component.state("top")).toBe(-10);
    });
});
