import * as React from "react";

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

    execDocumentCommand(e: React.MouseEvent<HTMLButtonElement>, command: string) {
        e.stopPropagation();
        e.preventDefault();

        if (e.button !== 0) {
            return;
        }

        document.execCommand(command, false);

        // Force a rerender to make the correct buttons active
        this.forceUpdate();
    }

    isActive(command: string): boolean {
        return document.queryCommandValue(command) === "true";
    }

    render() {
        return <div ref={el => this.tooltipElement = el} className="tooltip" style={{ left: this.state.left, top: this.state.top }}>
            <button className={this.isActive("bold") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "bold")}>
                <span className="icon-bold"></span>
            </button>
            <button className={this.isActive("italic") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "italic")}>
                <span className="icon-italic"></span>
            </button>
            <button className={this.isActive("underline") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "underline")}>
                <span className="icon-underline"></span>
            </button>
            <button className={this.isActive("strikethrough") ? "active" : ""} onMouseDown={e => this.execDocumentCommand(e, "strikethrough")}>
                <span className="icon-strikethrough"></span>
            </button>
        </div>;
    }
}
