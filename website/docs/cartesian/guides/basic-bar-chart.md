# Basic Bar Chart

This guide will show you how to create this bar chart with some customization like corners and gradients using the `CartesianChart` and `Bar` components.

<div className="max-w-xs mx-auto">

  ![Bar Chart Example](../assets/bar-guide-final.png)

</div>

1. To get started, you'll want to import the required components from **Victory Native** and **React Native**. For this guide we will assume this is being created in a `View` that represents a page or screen.

  ```tsx
  import { View } from "react-native";
  import { Bar, CartesianChart } from "victory-native";
  ```

2. Create some mock data. **Victory Native** requires data to be an array of objects with properties that can map to an `x` key and a `y` key. Read more about [the data and key props](../cartesian-chart#data-required). In this example we want a bar graph to show the number of listens a song gets for each month.
  
  ```tsx
  const data = Array.from({ length: 6 }, (_, index) => ({
      // Starting at 1 for Jaunary
      month: index + 1,
      // Randomizing the listen count between 100 and 50
      listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));
  ```

3. Connect the data and render the bar chart with default options:

  ```tsx
  <CartesianChart
    data={data}
    /**
     *  👇 the xKey should map to the property on data of you want on the x-axis
     */
    xKey="month"
    /** 
     * 👇 the yKey is an array of strings that map to the data you want
     * on the y-axis. In this case we only want the listenCount, but you could
     * add additional if you wanted to show multiple song listen counts.
     */
    yKeys={["listenCount"]}>
    {({ points, chartBounds }) => (
      <Bar 
        chartBounds={chartBounds}  // 👈 chartBounds is needed to know how to draw the bars
        points={points.listenCount} // 👈 points is an object with a property for each yKey
      />
    )}
  </CartesianChart>
  ```
  Once rendering, it should look like this:

  <div className="max-w-xs mx-auto">
  
  ![Bar Chart Example](../assets/bar-guide-step-3.png)
  
  </div>

  By default, the first and last bar will be cut off by the edge of the chart. This is because the `Bar` component is using the `chartBounds` to know where to draw the bars. The `chartBounds` are the bounds of the chart, not the bounds of the data. To fix this, we can add some domain padding to the chart.
  
4. Next we want to render axis labels with the month names. We will need a font object from **React Native Skia**. To get a font object, we use the `useFont` hook and pass it a ttf file and a size. We will also use the `formatXLabel` prop to format the month number from a number to a month name.
  
  ```tsx
  import { View } from "react-native";
  import { Bar, CartesianChart } from "victory-native";
  //👇 Import useFont from React Native Skia
  import { useFont } from "@shopify/react-native-skia";
  //👇 Also import a ttf file for the font you want to use.
  import inter from "../fonts/inter-medium.ttf";
  
  const MusicChart = () => {
    const font = useFont(inter, 12); //👈 Create a font object with the font file and size.
    
    return (
      <CartesianChart
        data={data}
        xKey="month"
        yKeys={["listenCount"]}
        axisOptions={{
          /**
           * 👇 Pass the font object to the axisOptions. 
           * This will tell CartesianChart to render axis labels.
           */
          font,
          /**
           * 👇 We will also use the formatXLabel prop to format the month number
           * from a number to a month name.
           */
          formatXLabel: (value) => {
            const date = new Date(2023, value - 1);
            return date.toLocaleString("default", { month: "short" });
          },
        }}
      >
        {({ points, chartBounds }) => (
          <Bar
            chartBounds={chartBounds}
            points={points.listenCount}
            /**
             * 👇 We can round the top corners of our bars by passing a number
             * to the roundedCorners prop. This will round the top left and top right.
             */
            roundedCorners={{
              topLeft: roundedCorner,
              topRight: roundedCorner,
            }}
          />
        )}
      </CartesianChart>
    )
  }
  
  ```

5. Finally, to add a Linear Gradient fill to our bars, we use the `LinearGradient` component we imported and pass it as a child to the `Bar` component.

  ```tsx
  //👇 Add LinearGradient and vec to our imports React Native Skia
  import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
  ```

  The `LinearGradient` component takes a `start` and `end` prop that are vectors that represent the direction of the gradient. It also takes a `colors` prop that is an array of strings that represent the colors of the gradient. The first color in the array will be the start color and the last color in the array will be the end color. You can also add additional colors to the array to create a gradient with more than two colors.
  
  ```tsx
  <Bar
   // same props as above
  >
    {/* 👇 We add a gradient to the bars by passing a LinearGradient as a child. */}
    <LinearGradient
      start={vec(0, 0)} // 👈 The start and end are vectors that represent the direction of the gradient.
      end={vec(0, 400)}
      colors={[ // 👈 The colors are an array of strings that represent the colors of the gradient.
        "#a78bfa",
        "#a78bfa50" // 👈 The second color is the same as the first but with an alpha value of 50%.
      ]}
    />
  </Bar>
  ```

6. The final result should look like this:

  <div className="max-w-xs mx-auto">

  ![Bar Chart Example](../assets/bar-guide-final.png)
  
  </div>
