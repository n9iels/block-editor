import { documentEditorUtils } from "../../src/util/document-editor-utils";

describe("documentEditorUtils", () => {
    beforeEach(() => {
        // Jest does not support document.queryCommandValue, so we have to mock it
        // eslint-disable-next-line
        document.queryCommandValue = jest.fn((commandId) => "True");
        // eslint-disable-next-line
        document.execCommand = jest.fn((command, showUI, value) => true);
    });

    it("should reset the block type to 'p' if the type is already active", () => {
        document.queryCommandValue = jest.fn(() => "h1");

        documentEditorUtils.toggleBlockType("h1");

        expect(document.execCommand).toHaveBeenCalledWith("formatBlock", false, "p");
    });

    it("should set the block type to the requested type if the type is not already set", () => {
        document.queryCommandValue = jest.fn(() => "p");

        documentEditorUtils.toggleBlockType("h1");

        expect(document.execCommand).toHaveBeenCalledWith("formatBlock", false, "h1");
    });
});
