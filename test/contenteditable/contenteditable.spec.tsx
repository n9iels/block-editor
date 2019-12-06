import * as React from "react";
import * as Renderer from "react-test-renderer";
import { ContentEditable } from "../../src/contenteditable/contenteditable";
import { configure, mount, ReactWrapper } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("contenteditable", () => {
    let mockExecCommand: jest.Mock<boolean>;
    let component: ReactWrapper;

    beforeEach(() => {
        // Jest does not support document.execCommand, so we have to mock it
        // eslint-disable-next-line
        mockExecCommand = jest.fn((command, showUI, value) => true);
        document.execCommand = mockExecCommand;

        component = mount(<ContentEditable onInput={jest.fn()} />);
    });

    it("should perform initial setup", () => {
        expect(Renderer.create(<ContentEditable onInput={jest.fn()} />).toJSON()).toMatchSnapshot();
        expect(mockExecCommand).toBeCalledWith("defaultParagraphSeparator", false, "p");
    });

    it("should rerender when 'html' input property is changed", () => {
        component.setProps({ html: "<p>props update</p>" });

        expect(component.state("html")).toBe("<p>props update</p>");
        expect(component.find("div[contentEditable=true]").html()).toBe("<div contenteditable=\"true\"><p>props update</p></div>");
    });

    it("should disable the editable div when property 'disabled' is true", () => {
        component.setProps({ disabled: true });

        expect(component.find("div[contentEditable=true]").exists()).toBeFalsy();
    });
});
