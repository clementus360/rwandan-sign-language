// components/Onboarding/shapes.tsx
import React from "react";
import { Circle, Polygon, Rect, Svg } from "react-native-svg";

export const Shape1 = ({ color }: { color: string }) => (
  <Svg width="100%" height="100%">
    <Circle cx="50%" cy="50%" r="40%" fill={color} />
  </Svg>
);

export const Shape2 = ({ color }: { color: string }) => (
  <Svg width="100%" height="100%">
    <Rect x="10%" y="10%" width="80%" height="80%" rx="30" fill={color} />
  </Svg>
);

export const Shape3 = ({ color }: { color: string }) => (
  <Svg width="100%" height="100%">
    <Polygon
      points="50,0 100,100 0,100"
      fill={color}
      transform="scale(3) translate(15, 30)"
    />
  </Svg>
);

// Map step index to shape component
export const backgroundShapes = [Shape1, Shape2, Shape3];