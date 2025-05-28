import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const TiltedArrowIcon = (props: SvgProps) => {

    const { stroke = "#fff", ...otherProps } = props;

    return (
        <Svg fill="none" {...props}>
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m4 13.012 8.667-8.667m0 0v8.32m0-8.32h-8.32"
            />
        </Svg>
    )
}

export default TiltedArrowIcon
