import * as React from "react";

interface ContentEditableProps {
    disabled?: boolean;
    html?: string;
    onBlur?: () => void;
    onFocus?: () => void;
    onInput: (value: string) => void;
}

interface ContentEditableState { html: string }

export class ContentEditable extends React.Component<ContentEditableProps, ContentEditableState> {
    private elementRef: HTMLDivElement;

    constructor(props: ContentEditableProps) {
        super(props);
        this.state = { html: this.props.html };
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

            this.setState({ html: this.props.html }, () => this.onInput());
        }
    }

    onInput() {
        const html = this.elementRef.innerHTML;

        this.setState({ html }, () => this.props.onInput(html));
    }

    render() {
        return React.createElement(
            "div",
            {
                onInput: () => this.onInput(),
                onBlur: () => this.props.onBlur(),
                onFocus: () => this.props.onFocus(),
                ref: (element: HTMLDivElement) => { this.elementRef = element; },
                suppressContentEditableWarning: true,
                contentEditable: !this.props.disabled,
                dangerouslySetInnerHTML: { __html: this.props.html ? this.props.html : "<p><br></p>" }
            }
        );
    }
}
