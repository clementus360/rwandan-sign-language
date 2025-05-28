import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const ChatIcon = (props: SvgProps) => {

    const { stroke = "#1F2937", ...otherProps } = props;

    return (
        <Svg fill="none" {...props}>
            <Path
                fill={stroke}
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM12 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM7 12.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"
            />
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22Z"
            />
        </Svg>
    )
}

export default ChatIcon
