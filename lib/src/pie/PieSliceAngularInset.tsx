import React from "react";
import { type Color, Path, type PathProps } from "@shopify/react-native-skia";
import { useSliceAngularInsetPath } from "./hooks/useSliceAngularInsetPath";
import { usePieSliceContext } from "./contexts/PieSliceContext";
import type { PathAnimationConfig } from "../hooks/useAnimatedPath";
import { AnimatedPath } from "../cartesian/components/AnimatedPath";

export type PieSliceAngularInsetData = {
	angularStrokeWidth: number;
	angularStrokeColor: Color;
};

type AdditionalPathProps = Partial<Omit<PathProps, "color" | "path">> & {
	animate?: PathAnimationConfig;
};

type PieSliceAngularInsetProps = {
	angularInset: PieSliceAngularInsetData;
} & AdditionalPathProps;

export const PieSliceAngularInset = (props: PieSliceAngularInsetProps) => {
	const { angularInset, children, animate, ...rest } = props;
	const { slice } = usePieSliceContext();
	const path = useSliceAngularInsetPath({ slice });

	// If the path is empty, don't render anything
	if (path.toSVGString() === "M0 0L0 0M0 0L0 0") {
		return null;
	}

	if (angularInset.angularStrokeWidth === 0) {
		return null;
	}

	const Component = animate ? AnimatedPath : Path;
	return (
		<Component
			path={path}
			style="stroke"
			color={angularInset.angularStrokeColor}
			strokeWidth={angularInset.angularStrokeWidth}
			animate={animate}
			{...rest}
		>
			{children}
		</Component>
	);
};
