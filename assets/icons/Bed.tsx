import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const BedIcon = (props: SvgProps) => {

    const { stroke = "#10B981", ...otherProps } = props

    return (
        <Svg fill="none" {...props}>
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.5 4.204v9.333a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V4.204a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2Z"
            />
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.5 6.204h5.333V4.871M14.5 6.204H9.167V4.871"
            />
        </Svg>
    )
}

export default BedIcon
