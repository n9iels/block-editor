import * as React from "react";

export interface TooltipProps {
    position: ClientRect;
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
        const left = props.position.left + (props.position.width / 2) - (state.tooltipWidth / 2);
        const top = props.position.top - props.position.height - (state.tooltipHeight / 2);

        return { left, top };
    }

    isActive(command: string) {
        document.queryCommandValue(command);
    }

    render() {
        return <div ref={el => this.tooltipElement = el} className="tooltip" style={{ left: this.state.left, top: this.state.top }}>
            <button>
                <span className="icon-bold"></span>
            </button>
            <button>
                <span className="icon-italic"></span>
            </button>
            <button>
                <span className="icon-underline"></span>
            </button>
            <button>
                <span className="icon-strikethrough"></span>
            </button>
        </div>;
    }
}
