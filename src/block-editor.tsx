import * as React from "react";
import { ContentEditable } from "./contenteditable/contenteditable";
import { Tooltip } from "./elements/tooltip";

export class BlockEditor extends React.Component<{}, { value: string; position: ClientRect }>{
    constructor(props: {}) {
        super(props);
        this.state = { value: "<p>okay1</p><p>okay2</p><p>okay3</p><p>okay4</p>", position: null };
    }

    onSelect(type: "Range" | "Caret", selectedText: string, position: ClientRect) {
        if (type === "Range") {
            this.setState({ position });
        } else {
            if (selectedText === "") {
                console.log("empty block");
            }
        }
    }

    render() {
        return (
            <div id="block-editor">
                {this.state.position && <Tooltip selectionPosition={this.state.position} />}

                <ContentEditable
                    html={this.state.value}
                    onInput={console.log}
                    onBlur={() => this.setState({ position: null }, () => console.log("blur"))}
                    onFocus={() => console.log("focus")}
                    onSelect={(type, content, position) => this.onSelect(type, content, position)}
                    onSelectStop={() => this.setState({ position: null })}
                />
            </div>
        );
    }
}
