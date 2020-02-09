import * as React from "react";
import { documentEditorUtils } from "../util/document-editor-utils";

export interface TooltipProps {
    selectionPosition: ClientRect;
}

export interface TooltipState {
    tooltipWidth: number;
    tooltipHeight: number;
    left: number;
    top: number;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
    private tooltipElement: HTMLDivElement;

    constructor(props: TooltipProps) {
        super(props);
        this.state = { tooltipWidth: 0, tooltipHeight: 0, left: 0, top: 0 };
    }

    componentDidMount() {
        const tooltipRect = this.tooltipElement.getBoundingClientRect();

        this.setState({ tooltipWidth: tooltipRect.width, tooltipHeight: tooltipRect.height });
    }

    static getDerivedStateFromProps(props: TooltipProps, state: TooltipState) {
        const top = props.selectionPosition.top - props.selectionPosition.height - (state.tooltipHeight / 2);
        let left = props.selectionPosition.left + (props.selectionPosition.width / 2) - (state.tooltipWidth / 2);

        if (props.selectionPosition.right <= state.tooltipWidth) {
            left = 0;
        }

        return { left, top };
    }

    execDocumentCommand(e: React.MouseEvent<HTMLButtonElement>, command: string, value: string = null) {
        e.stopPropagation();
        e.preventDefault();

        // only execute if the left mouse button is clicked
        if (e.button !== 0) {
            return;
        }

        if (command === "formatBlock") {
            documentEditorUtils.toggleBlockType(value);
        } else {
            documentEditorUtils.execCommand(command, value);
        }

        // Force a rerender to make the correct buttons active
        this.forceUpdate();
    }

    isActive(command: string, expectedValue: string): boolean {
        return documentEditorUtils.currentActiveCommand(command) === expectedValue;
    }

    render() {
        return <div ref={el => this.tooltipElement = el} className="tooltip" style={{ left: this.state.left, top: this.state.top }}>
            <button className={this.isActive("bold", "true") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "bold")}>
                <span className="icon-bold"></span>
            </button>
            <button className={this.isActive("italic", "true") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "italic")}>
                <span className="icon-italic"></span>
            </button>
            <button className={this.isActive("underline", "true") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "underline")}>
                <span className="icon-underline"></span>
            </button>
            <button className={this.isActive("strikethrough", "true") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "strikethrough")}>
                <span className="icon-strikethrough"></span>
            </button>
            <button className={this.isActive("formatBlock", "h2") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "formatBlock", "h2")}>
                <span className="icon-font-size"></span>
            </button>
        </div>;
    }
}
