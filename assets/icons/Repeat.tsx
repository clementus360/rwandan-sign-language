import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const RepeatIcon = (props: SvgProps) => {

    const { stroke = "#10B981", ...otherProps } = props

    return (
        <Svg fill="none" {...props}>
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.333 12.204h-6C4.223 12.204 2 11.537 2 8.871c0-2.667 2.222-3.334 3.333-3.334h5.334c1.11 0 3.333.667 3.333 3.334 0 .996-.31 1.713-.757 2.22"
            />
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m9.667 10.537 1.666 1.667-1.666 1.667"
            />
        </Svg>
    )
}
export default RepeatIcon
