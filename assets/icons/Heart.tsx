import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const HeartIcon = (props: SvgProps) => {

    const { stroke = "#10B981", ...otherProps } = props

    return (
        <Svg
            width={24}
            height={24}
            fill="none"
            {...props}
        >
            <Path
                stroke={stroke}
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.167 6.779a3.966 3.966 0 0 1-1.103 2.754c-1.627 1.686-3.206 3.445-4.894 5.07a.975.975 0 0 1-1.37-.03l-4.864-5.04c-1.47-1.524-1.47-3.984 0-5.508a3.72 3.72 0 0 1 5.387 0l.177.183.176-.183a3.742 3.742 0 0 1 2.694-1.154c1.013 0 1.982.416 2.694 1.154a3.967 3.967 0 0 1 1.103 2.754Z"
            />
        </Svg>
    )
}
export default HeartIcon
