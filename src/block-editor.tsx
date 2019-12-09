import * as React from "react";
import { ContentEditable } from "./contenteditable/contenteditable";
import { Tooltip } from "./elements/tooltip";

export class BlockEditor extends React.Component<{}, { value: string; position: ClientRect | DOMRect }>{
    constructor(props: {}) {
        super(props);
        this.state = { value: "<p>okay1</p><p>okay2</p><p>okay3</p><p>okay4</p>", position: null };
    }

    render() {
        return (
            <div id="block-editor">
                {this.state.position && <Tooltip position={this.state.position} />}

                <ContentEditable
                    html={this.state.value}
                    onInput={console.log}
                    onBlur={() => this.setState({ position: null })}
                    onFocus={() => console.log("focus")}
                    onSelect={(selectedText, position) =>
                        this.setState({ position })}
                    onSelectStop={() => this.setState({ position: null })}
                />
            </div>
        );
    }
}
