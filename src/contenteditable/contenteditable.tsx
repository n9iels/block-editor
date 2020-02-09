import * as React from "react";

export interface ContentEditableProps {
    disabled?: boolean;
    html?: string;
    onBlur?: () => void;
    onFocus?: () => void;
    onSelect?: (type: "Caret" | "Range", selectedText: string, selectionRect: ClientRect) => void;
    onSelectStop?: () => void;
    onInput: (value: string) => void;
}

export interface ContentEditableState { textRangeHasBeenSelected: boolean }

export class ContentEditable extends React.Component<ContentEditableProps, ContentEditableState> {
    private elementRef: HTMLDivElement;

    constructor(props: ContentEditableProps) {
        super(props);
        this.state = { textRangeHasBeenSelected: false };
    }

    componentDidMount() {
        document.execCommand("defaultParagraphSeparator", false, "p");
    }

    shouldComponentUpdate(nextProps: ContentEditableProps) {
        if (nextProps.html !== this.props.html) {
            return true;
        }

        return this.props.disabled !== nextProps.disabled;
    }

    componentDidUpdate(nextProps: ContentEditableProps) {
        // The editable div is not managed by react, thus we have to update the content manualy
        if (this.props.html !== nextProps.html) {
            this.elementRef.innerHTML = this.props.html;

            this.onInput();
        }
    }

    onInput() {
        this.props.onInput(this.elementRef.innerHTML);

        // The change in input might cause the current selected elements to be moved.
        if (this.state.textRangeHasBeenSelected) {
            this.onSelect();
        }
    }

    onSelect() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        if (!selection || !range) {
            return;
        }

        // Stop the selection if there is a click elsewhere in the document
        if (this.state.textRangeHasBeenSelected && selection.type === "Caret") {
            this.setState({ textRangeHasBeenSelected: false }, () => this.props.onSelectStop && this.props.onSelectStop());
        }
        
        if (!this.state.textRangeHasBeenSelected && selection.type === "Caret") {
            let focusElement = range.commonAncestorContainer as HTMLElement;

            // If the selected node is just text we need the parent node to get a cursor position
            if (focusElement.nodeName === "#text") {
                focusElement = focusElement.parentElement;
            }

            this.props.onSelect && this.props.onSelect("Caret", focusElement.textContent, focusElement.getClientRects().item(0));
        }

        if (selection.type === "Range" && range && range.startOffset <= range.endOffset) {
            const selectedText = selection.toString();
            const clientRects = range.getClientRects();

            this.setState({ textRangeHasBeenSelected: true }, () => this.props.onSelect && this.props.onSelect("Range", selectedText, clientRects.item(0)));
        }
    }

    render() {
        return React.createElement(
            "div",
            {
                onInput: () => this.onInput(),
                onBlur: () => this.props.onBlur && this.props.onBlur(),
                onFocus: () => this.props.onFocus && this.props.onFocus(),
                onSelect: () => this.onSelect(),
                ref: (element: HTMLDivElement) => { this.elementRef = element; },
                suppressContentEditableWarning: true,
                contentEditable: !this.props.disabled,
                dangerouslySetInnerHTML: { __html: this.props.html ? this.props.html : "<p><br></p>" }
            }
        );
    }
}
