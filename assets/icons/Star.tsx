import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const StarIcon = (props: SvgProps) => {

  const { stroke = "#1F2937", ...otherProps } = props;

  return (
    <Svg fill="none" {...props}>
      <Path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m9.952 9.623 1.559-3.305a.535.535 0 0 1 .978 0l1.559 3.305 3.485.533c.447.068.625.644.302.974l-2.522 2.57.595 3.631c.077.467-.391.822-.791.602L12 16.218l-3.117 1.715c-.4.22-.868-.135-.791-.602l.595-3.63-2.522-2.571c-.323-.33-.145-.906.302-.974l3.485-.533ZM22 12h1M12 2V1M12 23v-1M20 20l-1-1M20 4l-1 1M4 20l1-1M4 4l1 1M1 12h1"
      />
    </Svg>
  )
}

export default StarIcon
