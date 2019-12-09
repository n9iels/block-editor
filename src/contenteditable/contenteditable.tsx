import * as React from "react";

export interface ContentEditableProps {
    disabled?: boolean;
    html?: string;
    onBlur?: () => void;
    onFocus?: () => void;
    onSelect?: (selectedText: string, rect: ClientRect) => void;
    onSelectStop?: () => void;
    onInput: (value: string) => void;
}

export interface ContentEditableState { selection: Selection }

export class ContentEditable extends React.Component<ContentEditableProps, ContentEditableState> {
    private elementRef: HTMLDivElement;

    constructor(props: ContentEditableProps) {
        super(props);
        this.state = { selection: null };
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
    }

    onSelect() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        if (!selection || !range) {
            return;
        }

        if (this.state.selection && selection.type === "Caret") {
            this.setState({ selection: null }, () => this.props.onSelectStop && this.props.onSelectStop());
        }

        if (selection.type === "Range" && range && range.startOffset !== range.endOffset) {
            const selectedText = selection.toString();
            const rangeclientRect = range.getClientRects().item(0);

            this.setState({ selection: selection }, () => this.props.onSelect && this.props.onSelect(selectedText, rangeclientRect));
        }
    }

    render() {
        return React.createElement(
            "div",
            {
                onInput: () => this.onInput(),
                onBlur: () => this.props.onBlur(),
                onFocus: () => this.props.onFocus(),
                onSelect: () => this.onSelect(),
                ref: (element: HTMLDivElement) => { this.elementRef = element; },
                suppressContentEditableWarning: true,
                contentEditable: !this.props.disabled,
                dangerouslySetInnerHTML: { __html: this.props.html ? this.props.html : "<p><br></p>" }
            }
        );
    }
}
