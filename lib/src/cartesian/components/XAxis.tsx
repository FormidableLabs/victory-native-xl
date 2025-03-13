import React, { useMemo } from "react"
import { StyleSheet } from "react-native"
import { Group, Line, Text, vec, type SkPoint } from "@shopify/react-native-skia"
import { getOffsetFromAngle } from "../../utils/getOffsetFromAngle"
import { boundsToClip } from "../../utils/boundsToClip"
import { DEFAULT_TICK_COUNT, downsampleTicks } from "../../utils/tickHelpers"
import type { InputDatum, InputFields, ValueOf, XAxisProps, XAxisPropsWithDefaults } from "../../types"
import { type SharedValue, useDerivedValue } from "react-native-reanimated"

export const XAxis = <RawData extends Record<string, unknown>, XK extends keyof InputFields<RawData>>({
  xScale: xScaleProp,
  ignoreClip,
  yScale,
  axisSide = "bottom",
  yAxisSide = "left",
  labelPosition = "outset",
  labelRotate,
  tickCount = DEFAULT_TICK_COUNT,
  tickValues,
  labelOffset = 2,
  labelColor = "#000000",
  lineWidth = StyleSheet.hairlineWidth,
  lineColor = "hsla(0, 0%, 0%, 0.25)",
  font,
  formatXLabel = (label: ValueOf<InputDatum>) => String(label),
  ix = [],
  isNumericalData,
  linePathEffect,
  chartBounds,
  enableRescaling,
  zoom,
  scrollX,
}: XAxisProps<RawData, XK> & { scrollX: SharedValue<number> }) => {
  const transformX = useDerivedValue(() => {
    return [{ translateX: -scrollX.value }]
  }, [scrollX])

  // Create a mapping of unique values to their first occurrence index
  const uniqueValueIndices = useMemo(() => {
    return ix.reduce((acc, val, index) => {
      if (!acc.has(val)) {
        acc.set(val, index)
      }
      return acc
    }, new Map<string, number>())
  }, [ix])

  const xScale = zoom ? zoom.rescaleX(xScaleProp) : xScaleProp
  const [y1 = 0, y2 = 0] = yScale.domain()
  const fontSize = font?.getSize() ?? 0

  // Use tickValues if provided, otherwise generate ticks
  const xTicksNormalized = tickValues
    ? downsampleTicks(tickValues, tickCount)
    : enableRescaling
    ? xScale.ticks(tickCount)
    : xScaleProp.ticks(tickCount)

  const xAxisNodes = xTicksNormalized.map((tick) => {
    // Use the first occurrence index for positioning if available
    const indexPosition = uniqueValueIndices.get(String(tick)) ?? tick
    const p1 = vec(xScale(indexPosition), yScale(y2))
    const p2 = vec(xScale(indexPosition), yScale(y1))

    const val = isNumericalData ? tick : ix[indexPosition]

    const contentX = formatXLabel(val as never)
    const labelWidth = font?.getGlyphWidths?.(font.getGlyphIDs(contentX)).reduce((sum, value) => sum + value, 0) ?? 0
    const labelX = xScale(indexPosition) - (labelWidth ?? 0) / 2
    const canFitLabelContent = true

    const labelY = (() => {
      // bottom, outset
      if (axisSide === "bottom" && labelPosition === "outset") {
        return chartBounds.bottom + labelOffset + fontSize
      }
      // bottom, inset
      if (axisSide === "bottom" && labelPosition === "inset") {
        return yScale(y2) - labelOffset
      }
      // top, outset
      if (axisSide === "top" && labelPosition === "outset") {
        return yScale(y1) - labelOffset
      }
      // top, inset
      return yScale(y1) + fontSize + labelOffset
    })()

    // Calculate origin and translate for label rotation
    const { origin, rotateOffset } = ((): {
      origin: SkPoint | undefined
      rotateOffset: number
    } => {
      let rotateOffset = 0
      let origin

      // return defaults if no labelRotate is provided
      if (!labelRotate) return { origin, rotateOffset }

      if (axisSide === "bottom" && labelPosition === "outset") {
        // bottom, outset
        origin = vec(labelX + labelWidth / 2, labelY)
        rotateOffset = Math.abs((labelWidth / 2) * getOffsetFromAngle(labelRotate))
      } else if (axisSide === "bottom" && labelPosition === "inset") {
        // bottom, inset
        origin = vec(labelX + labelWidth / 2, labelY)
        rotateOffset = -Math.abs((labelWidth / 2) * getOffsetFromAngle(labelRotate))
      } else if (axisSide === "top" && labelPosition === "inset") {
        // top, inset
        origin = vec(labelX + labelWidth / 2, labelY - fontSize / 4)
        rotateOffset = Math.abs((labelWidth / 2) * getOffsetFromAngle(labelRotate))
      } else {
        // top, outset
        origin = vec(labelX + labelWidth / 2, labelY - fontSize / 4)
        rotateOffset = -Math.abs((labelWidth / 2) * getOffsetFromAngle(labelRotate))
      }

      return { origin, rotateOffset }
    })()

    return (
      <React.Fragment key={`x-tick-${tick}`}>
        {lineWidth > 0 ? (
          <Group transform={transformX} clip={ignoreClip ? boundsToClip(chartBounds) : undefined}>
            <Line p1={p1} p2={p2} color={lineColor} strokeWidth={lineWidth}>
              {linePathEffect ? linePathEffect : null}
            </Line>
          </Group>
        ) : null}
        {font && labelWidth && canFitLabelContent ? (
          <Group transform={transformX}>
            <Text
              transform={[
                {
                  rotate: (Math.PI / 180) * (labelRotate ?? 0),
                },
              ]}
              origin={origin}
              color={labelColor}
              text={contentX}
              font={font}
              y={labelY}
              x={labelX}
            />
          </Group>
        ) : null}
        <></>
      </React.Fragment>
    )
  })

  return xAxisNodes
}

export const XAxisDefaults = {
  lineColor: "hsla(0, 0%, 0%, 0.25)",
  lineWidth: StyleSheet.hairlineWidth,
  tickCount: 5,
  labelOffset: 2,
  axisSide: "bottom",
  yAxisSide: "left",
  labelPosition: "outset",
  formatXLabel: (label: ValueOf<InputDatum>) => String(label),
  labelColor: "#000000",
  labelRotate: 0,
} satisfies XAxisPropsWithDefaults<never, never>
