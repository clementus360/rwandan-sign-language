import * as React from "react"
import Svg, { Path, Rect, SvgProps } from "react-native-svg"

const BarChartIcon = (props: SvgProps) => {

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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                d="M32 32v432a16 16 0 0 0 16 16h432"
            />
            <Rect
                width={80}
                height={192}
                x={96}
                y={224}
                fill="none"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                rx={20}
                ry={20}
            />
            <Rect
                width={80}
                height={240}
                x={240}
                y={176}
                fill="none"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                rx={20}
                ry={20}
            />
            <Rect
                width={80}
                height={304}
                x={383.64}
                y={112}
                fill="none"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={32}
                rx={20}
                ry={20}
            />
        </Svg>
    )
}
export default BarChartIcon
