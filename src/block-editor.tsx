import * as React from "react";
import { ContentEditable } from "./contenteditable/contenteditable";

export class BlockEditor extends React.Component<{}, { value: string; position: { x: number; y: number } }>{
    constructor(props: {}) {
        super(props);
        this.state = { value: "<p>okay</p>", position: { x: 0, y: 0 } };
    }

    changeValue(newValue: string) {
        this.setState({ value: newValue });
    }

    render() {
        return <>
            <div style={{ left: this.state.position.x, top: this.state.position.y, width: 30, height: 10, position: "absolute", backgroundColor: "red" }} />

            <ContentEditable
                html={this.state.value}
                onInput={console.log}
                onBlur={() => console.log("blur")}
                onFocus={() => console.log("focus")}
                onSelect={(selectedText, position) => this.setState({ position: { x: position.left, y: position.top } })}
                onSelectStop={() => console.log("stop select")}
            />
        </>;
    }
}
