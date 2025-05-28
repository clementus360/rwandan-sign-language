import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const ArrowLeftCircleIcon = (props: SvgProps) => {

    const { stroke = "#10B981", ...otherProps } = props;

    return (
        <Svg fill="none" {...props}>
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.167 8.87H5.833m0 0 2.334 2.334M5.833 8.871l2.334-2.334M8.5 15.537a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333Z"
            />
        </Svg>
    )
}
export default ArrowLeftCircleIcon
