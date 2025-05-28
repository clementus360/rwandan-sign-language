import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const AppleIcon = (props: SvgProps) => {

    const { stroke = "#10B981", ...otherProps } = props

    return (
        <Svg fill="none" {...props}>
            <Path
                stroke={stroke}
                strokeWidth={1.5}
                d="M4.002 4.458c.403-.201.947-.271 1.683-.186.551.063 1.172.21 1.863.417l.715.226.26.087.256-.101c1.648-.66 3.045-.873 3.987-.434.844.394 1.65 1.497 1.65 4.403 0 2.874-.796 4.444-1.801 5.248-1.014.812-2.425.993-3.968.684l-.147-.03-.147.03c-1.543.309-2.954.128-3.968-.684-1.005-.804-1.802-2.374-1.802-5.248 0-2.973.675-4.04 1.42-4.412Z"
            />
            <Path
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8.5 4.537c0-1.666-.667-2.333-2-2.333"
            />
        </Svg>
    )
}

export default AppleIcon
