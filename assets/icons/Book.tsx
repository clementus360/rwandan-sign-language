import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const BookIcon = (props: SvgProps) => {

  const { stroke = "#1F2937", ...otherProps } = props;

  return (
    <Svg fill="none" {...props}>
      <Path
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M4 19V5a2 2 0 0 1 2-2h13.4a.6.6 0 0 1 .6.6v13.114M6 17h14M6 21h14"
      />
      <Path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 21a2 2 0 1 1 0-4"
      />
      <Path stroke={stroke} strokeLinecap="round" strokeWidth={1.5} d="M9 7h6" />
    </Svg>
  )
}

export default BookIcon
