class DocumentEditorUtils {
    public toggleBlockType(type: string) {
        const isActive = this.currentActiveCommand("formatBlock") === type;

        if (isActive) {
            document.execCommand("formatBlock", false, "p");
        } else {
            document.execCommand("formatBlock", false,  type);
        }
    }

    public execCommand(command: string, value = "") {
        document.execCommand(command, false, value);
    }

    public currentActiveCommand(command: string) {
        return document.queryCommandValue(command);
    }
}

export const documentEditorUtils = new DocumentEditorUtils;
