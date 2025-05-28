import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const CoffeeIcon = (props: SvgProps) => {
    
    const { stroke = "#10B981", ...otherProps } = props

    return (
    <Svg fill="none" {...props}>
        <Path
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.833 8.804v1.4a4.667 4.667 0 1 1-9.333 0v-1.4a.6.6 0 0 1 .6-.6h8.133a.6.6 0 0 1 .6.6ZM8.5 6.87c0-.666.476-1.333 1.429-1.333v0a1.905 1.905 0 0 0 1.904-1.904v-.429M5.833 6.87v-.333a2 2 0 0 1 2-2v0c.737 0 1.334-.597 1.334-1.333v-.333"
        />
        <Path
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.167 8.204h1.666a1.667 1.667 0 1 1 0 3.333h-1"
        />
    </Svg>
)}

export default CoffeeIcon
