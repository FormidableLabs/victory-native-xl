import * as React from "react"
import type { LayoutChangeEvent } from "react-native"
import { Canvas, type ClipDef, Group } from "@shopify/react-native-skia"
import { type SharedValue, useDerivedValue, useSharedValue } from "react-native-reanimated"
import { type ComposedGesture, Gesture, GestureHandlerRootView, type TouchData } from "react-native-gesture-handler"
import type { MutableRefObject } from "react"
import type { ScaleLinear } from "d3-scale"
import isEqual from "react-fast-compare"
import type {
  AxisProps,
  CartesianChartRenderArg,
  InputFields,
  NumericalFields,
  SidedNumber,
  TransformedData,
  ChartBounds,
  YAxisInputProps,
  XAxisInputProps,
  FrameInputProps,
  ChartPressPanConfig,
  Viewport,
} from "../types"
import { transformInputData } from "./utils/transformInputData"
import { findClosestPoint } from "../utils/findClosestPoint"
import { valueFromSidedNumber } from "../utils/valueFromSidedNumber"
import { asNumber } from "../utils/asNumber"
import type { ChartPressState, ChartPressStateInit } from "./hooks/useChartPressState"
import { useFunctionRef } from "../hooks/useFunctionRef"
import { CartesianChartProvider } from "./contexts/CartesianChartContext"
import { Frame } from "./components/Frame"
import { useBuildChartAxis } from "./hooks/useBuildChartAxis"
import type { ChartTransformState } from "./hooks/useChartTransformState"
import {
  panTransformGesture,
  type PanTransformGestureConfig,
  pinchTransformGesture,
  type PinchTransformGestureConfig,
  scrollTransformGesture,
} from "./utils/transformGestures"
import { CartesianTransformProvider } from "./contexts/CartesianTransformContext"
import { GestureHandler } from "../shared/GestureHandler"
import { boundsToClip } from "../utils/boundsToClip"
import { useChartAxis } from "./CartesianAxis"
export type CartesianActionsHandle<T = undefined> = T extends ChartPressState<infer S>
  ? S extends ChartPressStateInit
    ? {
        handleTouch: (v: T, x: number, y: number) => void
      }
    : never
  : never

type CartesianChartProps<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
> = {
  scrollState?: boolean
  data: RawData[]
  xKey: XK
  yKeys: YK[]
  padding?: SidedNumber
  domainPadding?: SidedNumber
  domain?: { x?: [number] | [number, number]; y?: [number] | [number, number] }
  viewport?: Viewport
  chartPressState?:
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>
    | ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>[]
  chartPressConfig?: {
    pan?: ChartPressPanConfig
  }
  children: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode
  renderOutside?: (args: CartesianChartRenderArg<RawData, YK>) => React.ReactNode
  axisOptions?: Partial<Omit<AxisProps<RawData, XK, YK>, "xScale" | "yScale">>
  onChartBoundsChange?: (bounds: ChartBounds) => void
  onScaleChange?: (xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>) => void
  /**
   * @deprecated This prop will eventually be replaced by the new `chartPressConfig`. For now it's being kept around for backwards compatibility sake.
   */
  gestureLongPressDelay?: number
  xAxis?: XAxisInputProps<RawData, XK>
  yAxis?: YAxisInputProps<RawData, YK>[]
  frame?: FrameInputProps
  transformState?: ChartTransformState
  transformConfig?: {
    pan?: PanTransformGestureConfig
    pinch?: PinchTransformGestureConfig
  }
  customGestures?: ComposedGesture
  actionsRef?: MutableRefObject<CartesianActionsHandle<
    | ChartPressState<{
        x: InputFields<RawData>[XK]
        y: Record<YK, number>
      }>
    | undefined
  > | null>
}

export function CartesianChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({ transformState, children, ...rest }: CartesianChartProps<RawData, XK, YK>) {
  return <CartesianChartContent {...{ ...rest, transformState }}>{children}</CartesianChartContent>
}

function CartesianChartContent<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  data,
  xKey,
  yKeys,
  padding,
  domainPadding,
  children,
  renderOutside = () => null,
  axisOptions,
  domain,
  chartPressState,
  chartPressConfig,
  onChartBoundsChange,
  onScaleChange,
  gestureLongPressDelay = 100,
  xAxis,
  yAxis,
  frame,
  transformState,
  transformConfig,
  customGestures,
  actionsRef,
  viewport,
  scrollState,
}: CartesianChartProps<RawData, XK, YK>) {
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const chartBoundsRef = React.useRef<ChartBounds | undefined>(undefined)
  const [hasMeasuredLayoutSize, setHasMeasuredLayoutSize] = React.useState(false)
  const onLayout = React.useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    setHasMeasuredLayoutSize(true)
    setSize(layout)
  }, [])
  const normalizedAxisProps = useBuildChartAxis({
    xAxis,
    yAxis,
    frame,
    yKeys,
    axisOptions,
  })

  const tData = useSharedValue<TransformedData<RawData, XK, YK>>({
    ix: [],
    ox: [],
    y: yKeys.reduce((acc, key) => {
      acc[key] = { i: [], o: [] }
      return acc
    }, {} as TransformedData<RawData, XK, YK>["y"]),
  })

  const { yAxes, xScale, chartBounds, isNumericalData, xTicksNormalized, _tData } = React.useMemo(() => {
    const { xScale, yAxes, isNumericalData, xTicksNormalized, ..._tData } = transformInputData({
      data,
      xKey,
      yKeys,
      outputWindow: {
        xMin: valueFromSidedNumber(padding, "left"),
        xMax: size.width - valueFromSidedNumber(padding, "right"),
        yMin: valueFromSidedNumber(padding, "top"),
        yMax: size.height - valueFromSidedNumber(padding, "bottom"),
      },
      domain,
      domainPadding,
      xAxis: normalizedAxisProps.xAxis,
      yAxes: normalizedAxisProps.yAxes,
      viewport,
      labelRotate: normalizedAxisProps.xAxis.labelRotate,
    })

    const primaryYAxis = yAxes[0]
    const primaryYScale = primaryYAxis.yScale
    const chartBounds = {
      left: xScale(viewport?.x?.[0] ?? xScale.domain().at(0) ?? 0),
      right: xScale(viewport?.x?.[1] ?? xScale.domain().at(-1) ?? 0),
      top: primaryYScale(viewport?.y?.[1] ?? (primaryYScale.domain().at(0) || 0)),
      bottom: primaryYScale(viewport?.y?.[0] ?? (primaryYScale.domain().at(-1) || 0)),
    }

    return {
      xTicksNormalized,
      yAxes,
      xScale,
      chartBounds,
      isNumericalData,
      _tData,
    }
  }, [data, xKey, yKeys, padding, size.width, size.height, domain, domainPadding, normalizedAxisProps, viewport])

  React.useEffect(() => {
    tData.value = _tData
  }, [_tData, tData])

  const primaryYAxis = yAxes[0]
  const primaryYScale = primaryYAxis.yScale

  // stacked bar values
  const chartHeight = chartBounds.bottom
  const yScaleTop = primaryYAxis.yScale.domain().at(0)
  const yScaleBottom = primaryYAxis.yScale.domain().at(-1)
  // end stacked bar values

  // scroll state
  const scrollX = useSharedValue(0)
  const prevTranslateX = useSharedValue(0)

  /**
   * Pan gesture handling
   */
  const lastIdx = useSharedValue(null as null | number)
  /**
   * Take a "press value" and an x-value and update the shared values accordingly.
   */
  const handleTouch = (v: ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>, x: number, y: number) => {
    "worklet"
    // Adjust x position for scroll in a single place
    const adjustedX = x + scrollX.value
    const idx = findClosestPoint(tData.value.ox, adjustedX)

    if (typeof idx !== "number") return

    const isInYs = (yk: string): yk is YK & string => yKeys.includes(yk as YK)

    // begin stacked bar handling:
    // store the heights of each bar segment
    const barHeights: number[] = []
    for (const yk in v.y) {
      if (isInYs(yk)) {
        const height = asNumber(tData.value.y[yk].i[idx])
        barHeights.push(height)
      }
    }

    const chartYPressed = chartHeight - y // Invert y-coordinate, since RNGH gives us the absolute Y, and we want to know where in the chart they clicked
    // Calculate the actual yValue of the touch within the domain of the yScale
    const yDomainValue = (chartYPressed / chartHeight) * (yScaleTop! - yScaleBottom!)

    // track the cumulative height and the y-index of the touched segment
    let cumulativeHeight = 0
    let yIndex = -1

    // loop through the bar heights to find which bar was touched
    for (let i = 0; i < barHeights.length; i++) {
      // Accumulate the height as we go along
      cumulativeHeight += barHeights[i]!
      // Check if the y-value touched falls within the current segment
      if (yDomainValue <= cumulativeHeight) {
        // If it does, set yIndex to the current segment index and break
        yIndex = i
        break
      }
    }

    // Update the yIndex value in the state or context
    v.yIndex.value = yIndex
    // end stacked bar handling

    if (v) {
      try {
        v.matchedIndex.value = idx
        v.x.value.value = tData.value.ix[idx]!
        v.x.position.value = asNumber(tData.value.ox[idx]) - scrollX.value
        for (const yk in v.y) {
          if (isInYs(yk)) {
            v.y[yk].value.value = asNumber(tData.value.y[yk].i[idx])
            v.y[yk].position.value = asNumber(tData.value.y[yk].o[idx])
          }
        }
      } catch (err) {
        // no-op
      }
    }

    lastIdx.value = idx
  }

  if (actionsRef) {
    actionsRef.current = {
      handleTouch,
    }
  }

  /**
   * Touch gesture is a modified Pan gesture handler that allows for multiple presses:
   * - Using Pan Gesture handler effectively _just_ for the .activateAfterLongPress functionality.
   * - Tracking the finger is handled with .onTouchesMove instead of .onUpdate, because
   *    .onTouchesMove gives us access to each individual finger.
   * - The activation gets a bit complicated because we want to wait til "start" state before updating Press Value
   *    which gives time for the gesture to get cancelled before we start updating the shared values.
   *    Therefore we use gestureState.bootstrap to store some "bootstrap" information if gesture isn't active when finger goes down.
   */
  // touch ID -> value index mapping to keep track of which finger updates which value
  const touchMap = useSharedValue({} as Record<number, number | undefined>)
  const activePressSharedValues = Array.isArray(chartPressState) ? chartPressState : [chartPressState]
  const gestureState = useSharedValue({
    isGestureActive: false,
    bootstrap: [] as [ChartPressState<{ x: InputFields<RawData>[XK]; y: Record<YK, number> }>, TouchData][],
  })

  const panGesture = Gesture.Pan()
    /**
     * When a finger goes down, either update the state or store in the bootstrap array.
     */
    .onTouchesDown((e) => {
      const vals = activePressSharedValues || []
      if (!vals.length || e.numberOfTouches === 0) return

      for (let i = 0; i < Math.min(e.allTouches.length, vals.length); i++) {
        const touch = e.allTouches[i]
        const v = vals[i]
        if (!v || !touch) continue

        if (gestureState.value.isGestureActive) {
          // Update the mapping
          if (typeof touchMap.value[touch.id] !== "number") touchMap.value[touch.id] = i

          v.isActive.value = true
          handleTouch(v, touch.x, touch.y)
        } else {
          gestureState.value.bootstrap.push([v, touch])
        }
      }
    })
    /**
     * On start, check if we have any bootstraped updates we need to apply.
     */
    .onStart(() => {
      gestureState.value.isGestureActive = true

      for (let i = 0; i < gestureState.value.bootstrap.length; i++) {
        const [v, touch] = gestureState.value.bootstrap[i]!
        // Update the mapping
        if (typeof touchMap.value[touch.id] !== "number") touchMap.value[touch.id] = i

        v.isActive.value = true
        handleTouch(v, touch.x, touch.y)
      }
    })
    /**
     * Clear gesture state on gesture end.
     */
    .onFinalize(() => {
      gestureState.value.isGestureActive = false
      gestureState.value.bootstrap = []
    })
    /**
     * As fingers move, update the shared values accordingly.
     */
    .onTouchesMove((e) => {
      const vals = activePressSharedValues || []
      if (!vals.length || e.numberOfTouches === 0) return

      for (let i = 0; i < Math.min(e.allTouches.length, vals.length); i++) {
        const touch = e.allTouches[i]
        const touchId = touch?.id
        const idx = typeof touchId === "number" && touchMap.value[touchId]
        const v = typeof idx === "number" && vals?.[idx]

        if (!v || !touch) continue
        if (!v.isActive.value) v.isActive.value = true
        handleTouch(v, touch.x, touch.y)
      }
    })
    /**
     * On each finger up, start to update values and "free up" the touch map.
     */
    .onTouchesUp((e) => {
      for (const touch of e.changedTouches) {
        const vals = activePressSharedValues || []

        // Set active state to false
        const touchId = touch?.id
        const idx = typeof touchId === "number" && touchMap.value[touchId]
        const val = typeof idx === "number" && vals[idx]
        if (val) {
          val.isActive.value = false
        }

        // Free up touch map for this touch
        touchMap.value[touch.id] = undefined
      }
    })
    /**
     * Once the gesture ends, ensure all active values are falsified.
     */
    .onEnd(() => {
      const vals = activePressSharedValues || []
      // Set active state to false for all vals
      for (const val of vals) {
        if (val) {
          val.isActive.value = false
        }
      }
    })

  if (!chartPressConfig?.pan) {
    /**
     * Activate after a long press, which helps with preventing all touch hijacking.
     * This is important if this chart is inside of some sort of scrollable container.
     */
    panGesture.activateAfterLongPress(gestureLongPressDelay)
  }

  if (chartPressConfig?.pan?.activateAfterLongPress) {
    panGesture.activateAfterLongPress(chartPressConfig.pan?.activateAfterLongPress)
  }
  if (chartPressConfig?.pan?.activeOffsetX) {
    panGesture.activeOffsetX(chartPressConfig.pan.activeOffsetX)
  }
  if (chartPressConfig?.pan?.activeOffsetY) {
    panGesture.activeOffsetX(chartPressConfig.pan.activeOffsetY)
  }
  if (chartPressConfig?.pan?.failOffsetX) {
    panGesture.failOffsetX(chartPressConfig.pan.failOffsetX)
  }
  if (chartPressConfig?.pan?.failOffsetY) {
    panGesture.failOffsetX(chartPressConfig.pan.failOffsetY)
  }

  /**
   * Allow end-user to request "raw-ish" data for a given yKey.
   * Generate this on demand using a proxy.
   */
  type PointsArg = CartesianChartRenderArg<RawData, YK>["points"]
  const points = React.useMemo<PointsArg>(() => {
    const cache = {} as Record<YK, PointsArg[keyof PointsArg]>
    return new Proxy(
      {},
      {
        get(_, property: string): PointsArg[keyof PointsArg] | undefined {
          const key = property as YK
          if (!yKeys.includes(key)) return undefined
          if (cache[key]) return cache[key]

          cache[key] = _tData.ix.map((x, i) => ({
            x: asNumber(_tData.ox[i]),
            xValue: x,
            y: _tData.y[key].o[i],
            yValue: _tData.y[key].i[i],
          }))

          return cache[key]
        },
      },
    ) as PointsArg
  }, [_tData, yKeys])

  // On bounds change, emit
  const onChartBoundsRef = useFunctionRef(onChartBoundsChange)
  React.useEffect(() => {
    if (!isEqual(chartBounds, chartBoundsRef.current)) {
      chartBoundsRef.current = chartBounds
      onChartBoundsRef.current?.(chartBounds)
    }
  }, [chartBounds, onChartBoundsRef])

  const renderArg: CartesianChartRenderArg<RawData, YK> = {
    xScale,
    xTicks: xTicksNormalized,
    yScale: primaryYScale,
    yTicks: primaryYAxis.yTicksNormalized,
    chartBounds,
    canvasSize: size,
    points,
  }

  const clipRect = boundsToClip(chartBounds)

  const FrameComponent =
    hasMeasuredLayoutSize && (axisOptions || frame) ? <Frame {...normalizedAxisProps.frame} xScale={xScale} yScale={primaryYScale} /> : null

  const dimensions = React.useMemo(() => {
    const totalContentWidth = _tData.ox.length > 0 ? Math.max(..._tData.ox) - Math.min(..._tData.ox) : 0

    return {
      x: Math.min(xScale.range()[0] ?? 0, 0),
      y: Math.min(primaryYScale.range()[0] ?? 0, 0),
      width: (xScale.range()[1] ?? 0) - (xScale.range()[0] ?? 0),
      height: (primaryYScale.range()[1] ?? 0) - (primaryYScale.range()[0] ?? 0),
      totalContentWidth,
    }
  }, [xScale, primaryYScale, _tData.ox])

  // Memoize the composed gesture

  const composedGesture = React.useMemo(() => {
    let composed = customGestures ?? Gesture.Race()
    if (transformState && !scrollState) {
      if (transformConfig?.pinch?.enabled ?? true) {
        composed = Gesture.Race(composed, pinchTransformGesture(transformState, transformConfig?.pinch))
      }
      if (transformConfig?.pan?.enabled ?? true) {
        composed = Gesture.Race(composed, panTransformGesture(transformState, transformConfig?.pan))
      }
    } else if (scrollState) {
      composed = Gesture.Race(
        composed,
        scrollTransformGesture({
          scrollX,
          prevTranslateX,
          viewportWidth: size.width,
          length: _tData.ix.length,
          dimensions,
        }),
      )
    }
    if (chartPressState) {
      composed = Gesture.Race(composed, panGesture)
    }

    return composed
  }, [
    size.width,
    dimensions,
    _tData.ix.length,
    panGesture,
    chartPressState,
    transformState,
    scrollState,
    transformConfig,
    customGestures,
    prevTranslateX,
    scrollX,
  ])

  return (
    <GestureHandlerRootView style={{ flex: 1, overflow: "hidden" }}>
      <ChartBody
        onLayout={onLayout}
        FrameComponent={FrameComponent}
        primaryYScale={primaryYScale}
        xScale={xScale}
        clipRect={clipRect}
        transformState={transformState}
        hasMeasuredLayoutSize={hasMeasuredLayoutSize}
        renderArg={renderArg}
        renderOutside={renderOutside}
        yKeys={yKeys}
        axisOptions={axisOptions}
        onScaleChange={onScaleChange}
        xAxis={xAxis}
        yAxis={yAxis}
        frame={frame}
        chartBounds={chartBounds}
        yAxes={yAxes}
        isNumericalData={isNumericalData}
        _tData={_tData}
        scrollX={scrollX}
      >
        {children}
      </ChartBody>
      <GestureHandler gesture={composedGesture} transformState={transformState} dimensions={dimensions} derivedScrollX={scrollX} />
    </GestureHandlerRootView>
  )
}

type ChartBodyProps<RawData extends Record<string, unknown>, YK extends keyof NumericalFields<RawData>> = {
  onLayout: (event: LayoutChangeEvent) => void
  FrameComponent: React.ReactNode
  primaryYScale: ScaleLinear<number, number>
  xScale: ScaleLinear<number, number>
  clipRect: ClipDef
  hasMeasuredLayoutSize: boolean
  renderArg: CartesianChartRenderArg<RawData, YK>
  scrollX: SharedValue<number>
  children: (args: CartesianChartRenderArg<RawData, YK> | any) => React.ReactNode
  renderOutside?: (args: CartesianChartRenderArg<RawData, YK> | any) => React.ReactNode
  transformState?: ChartTransformState
  yKeys: YK[] | any
  axisOptions: any
  onScaleChange?: (xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>) => void
  xAxis?: any
  yAxis?: any
  frame?: any
  chartBounds: any
  yAxes: any
  isNumericalData: any
  _tData: any
}

const ChartBody = React.memo(
  <RawData extends Record<string, unknown>, YK extends keyof NumericalFields<RawData>>(propList: ChartBodyProps<RawData, YK>) => {
    const {
      onLayout,
      FrameComponent,
      primaryYScale,
      xScale,
      clipRect,
      hasMeasuredLayoutSize,
      renderArg,
      scrollX,
      children,
      renderOutside,
      transformState,
    } = propList
    const transform = useDerivedValue(() => {
      return [{ translateX: -scrollX.value }]
    })

    const AxisComponents = (
      <CartesianTransformProvider transformState={transformState}>
        <AxisComponent {...propList} />
      </CartesianTransformProvider>
    )
    return (
      <Canvas style={{ flex: 1 }} onLayout={onLayout}>
        {FrameComponent}

        {AxisComponents}
        <Group>
          <CartesianChartProvider yScale={primaryYScale} xScale={xScale}>
            <Group clip={clipRect}>
              <Group transform={transform}>{hasMeasuredLayoutSize && children(renderArg)}</Group>
            </Group>
          </CartesianChartProvider>
        </Group>
        {hasMeasuredLayoutSize && renderOutside?.(renderArg)}
      </Canvas>
    )
  },
)

function AxisComponent(props: any) {
  const axis = useChartAxis(props)
  return (
    <>
      {axis.YAxisComponents}
      {axis.XAxisComponents}
    </>
  )
}
