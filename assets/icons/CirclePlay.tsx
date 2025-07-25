import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const CirclePlayIcon = (props: SvgProps) => {

    const { stroke = "#10B981", ...otherProps } = props

    return (
        <Svg
            className="ionicon"
            viewBox="0 0 512 512"
            width={24}
            height={24}
            {...props}
        >
            <Path
                fill="none"
                stroke={stroke}
                strokeMiterlimit={10}
                strokeWidth={32}
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
            />
            <Path fill={stroke} d="m216.32 334.44 114.45-69.14a10.89 10.89 0 0 0 0-18.6l-114.45-69.14a10.78 10.78 0 0 0-16.32 9.31v138.26a10.78 10.78 0 0 0 16.32 9.31z" />
        </Svg>
    )
}
export default CirclePlayIcon
