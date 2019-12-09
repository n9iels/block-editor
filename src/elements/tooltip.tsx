import * as React from "react";

interface TooltipProps {
    position: ClientRect;
}

interface TooltipState {
    tooltipWidth: number;
    left: number;
    top: number;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
    private tooltipElement: HTMLDivElement;

    constructor(props: TooltipProps) {
        super(props);
        this.state = { tooltipWidth: 0, left: 0, top: 0 };
    }

    componentDidMount() {
        this.setState({ tooltipWidth: this.tooltipElement.getBoundingClientRect().width });
    }

    isActive(command: string) {
        document.queryCommandValue(command);
    }

    static getDerivedStateFromProps(props: TooltipProps, state: TooltipState) {
        const left = props.position.left + (props.position.width / 2) - (state.tooltipWidth / 2);
        const top = props.position.top - props.position.height - (props.position.height / 2);

        return { left, top };
    }

    render() {
        return <div ref={el => this.tooltipElement = el} className="tooltip" style={{ left: this.state.left, top: this.state.top }}>tooltip</div>;
    }
}
