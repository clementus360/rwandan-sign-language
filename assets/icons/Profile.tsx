import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const ProfileIcon = (props: SvgProps) => {

    const { stroke = "#1F2937", ...otherProps } = props;

    return (
        <Svg fill="none" {...props}>
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z"
            />
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4.271 18.346s2.23-2.846 7.73-2.846 7.729 2.846 7.729 2.846M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
        </Svg>
    )
}

export default ProfileIcon
