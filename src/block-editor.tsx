import * as React from "react";
import { ContentEditable } from "./contenteditable/contenteditable";

export class BlockEditor extends React.Component<{}, { value: string }>{
    constructor(props: {}) {
        super(props);
        this.state = { value: "<p>okay</p>" };
    }

    changeValue(newValue: string) {
        this.setState({ value: newValue });
    }

    render() {
        return <>
            <button onClick={() => this.changeValue("<p>changed</p>")}>test</button>

            <ContentEditable
                // html={this.state.value}
                onInput={console.log}
                onBlur={() => console.log("blur")}
                onFocus={() => console.log("focus")}
            />
        </>;
    }
}
