import * as React from "react";
import * as Renderer from "react-test-renderer";
import { ContentEditable, ContentEditableProps, ContentEditableState } from "../../src/contenteditable/contenteditable";
import { configure, mount, ReactWrapper } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("contenteditable", () => {
    let mockExecCommand: jest.Mock<boolean>;
    let component: ReactWrapper<ContentEditableProps, ContentEditableState, ContentEditable>;

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
        component.setProps({ html: "<p>content</p>" });
        expect(component.find("div[contentEditable=true]").html()).toBe("<div contenteditable=\"true\"><p>content</p></div>");

        component.setProps({ html: "<p>content update</p>" });
        expect(component.find("div[contentEditable=true]").html()).toBe("<div contenteditable=\"true\"><p>content update</p></div>");
    });

    it("should disable the editable div when property 'disabled' is true", () => {
        component.setProps({ disabled: true });

        expect(component.find("div[contentEditable=true]").exists()).toBeFalsy();
    });

    it("should clear the selection state and call the prop 'onSelectStop' when the selection is cleared", () => {
        window.getSelection = jest.fn().mockReturnValue({ type: "Caret", getRangeAt: jest.fn });
        const onSelectStopMock = jest.fn();
        const onSelectMock = jest.fn();

        component.setProps({ onSelect: onSelectMock, onSelectStop: onSelectStopMock });
        component.setState({ selection: {} as Selection });
        component.instance().onSelect();

        expect(component.state("selection")).toBe(null);
        expect(onSelectStopMock).toBeCalledTimes(1);
        expect(onSelectMock).toBeCalledTimes(0);
    });

    it("should set the state 'selection' and call the prop 'onSelect' when a selection is made", () => {
        const onSelectStopMock = jest.fn();
        const onSelectMock = jest.fn();
        const clientRectMock = jest.fn().mockReturnValue({ item: jest.fn().mockReturnValue({ left: 99 }) });
        const getRangeAtMock = jest.fn()
            .mockReturnValue({ getClientRects: clientRectMock, startOffset: 0, endOffset: 1 });
        window.getSelection = jest.fn().mockReturnValue({ type: "Range", getRangeAt: getRangeAtMock, toString: () => "selected_text" });

        component.setProps({ onSelect: onSelectMock, onSelectStop: onSelectStopMock });
        component.setState({ selection: null });
        component.instance().onSelect();

        expect(onSelectMock).toHaveBeenCalledWith("selected_text", { left: 99 });
        expect(onSelectStopMock).toHaveBeenCalledTimes(0);
    });
});
