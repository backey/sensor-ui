import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

const CustomLineChart = ({
  data,
  color,
  avgColor,
  xName,
  yName,
  avgYName,
  xKey,
  yKey,
  avgYKey,
  height,
  unit,
  tickFormatter,
  labelFormatter,
  syncId,
  average,
  averageColor,
  padding,
  leftArea,
  rightArea,
  ...rest
}) => {
  const [showLineState, setShowLineState] = useState({
    [yKey]: true,
    [avgYKey]: true,
  });

  if (!data || !data.length) {
    return <h1 className="my-3 text-center">Nema podataka za prikaz</h1>;
  }

  const xTicks = [];
  let hour = Math.floor(data[0].time / (1000 * 60 * 60) + 1) * 1000 * 60 * 60;
  const hours = Math.ceil(
    (data[data.length - 1].time - data[0].time) / (1000 * 60 * 60)
  );
  for (let i = 0; i < hours; i++) {
    if (data[0].time < hour && data[data.length - 1].time > hour) {
      xTicks.push(hour);
    }
    hour += 1000 * 60 * 60;
  }

  const yTicks = [];
  const values = data.map((x) => x[yKey]);
  const botValue = parseFloat((Math.min(...values) - padding).toFixed(1));
  const topValue = parseFloat((Math.max(...values) + padding + 0.1).toFixed(1));
  for (let i = botValue; i <= topValue; i += 0.1) {
    yTicks.push(i.toFixed(1));
  }

  const handleLegendClick = (o) => {
    setShowLineState((oldState) => ({
      ...oldState,
      [o.dataKey]: !oldState[o.dataKey],
    }));
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          syncId={syncId}
          style={{ userSelect: "none" }}
          {...rest}
        >
          <XAxis
            dataKey={xKey}
            name={xName}
            tickFormatter={tickFormatter}
            domain={["dataMin", "dataMax"]}
            ticks={xTicks}
            minTickGap={30}
            type="number"
          />
          <YAxis
            ticks={yTicks}
            minTickGap={36}
            unit={unit}
            domain={[`dataMin - ${padding}`, `dataMax + ${padding}`]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            formatter={(x) => parseFloat(x).toFixed(1) + unit}
            labelFormatter={labelFormatter}
          />
          <Legend
            onClick={handleLegendClick}
            wrapperStyle={{ cursor: "pointer" }}
          />
          {average !== undefined && (
            <ReferenceLine y={average} stroke={averageColor} />
          )}
          <Line
            type="monotone"
            dataKey={yKey}
            name={yName}
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            opacity={showLineState[yKey] ? 1 : 0.1}
          />
          {avgYName && avgYKey && avgColor && (
            <Line
              type="monotone"
              dataKey={avgYKey}
              name={avgYName}
              stroke={avgColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              opacity={showLineState[avgYKey] ? 1 : 0.1}
            />
          )}
          {leftArea && rightArea && (
            <ReferenceArea x1={leftArea} x2={rightArea} strokeOpacity={0.3} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

CustomLineChart.defaultProps = {
  height: "400px",
  unit: "",
  padding: 0.1,
};

CustomLineChart.propTypes = {
  data: PropTypes.array.isRequired,
  color: PropTypes.string,
  avgColor: PropTypes.string,
  xName: PropTypes.string,
  yName: PropTypes.string,
  avgYName: PropTypes.string,
  xKey: PropTypes.string.isRequired,
  yKey: PropTypes.string.isRequired,
  avgYKey: PropTypes.string,
  height: PropTypes.string,
  unit: PropTypes.string,
  tickFormatter: PropTypes.func,
  labelFormatter: PropTypes.func,
  syncId: PropTypes.string,
  average: PropTypes.number,
  averageColor: PropTypes.string,
  padding: PropTypes.number,
  leftArea: PropTypes.number,
  rightArea: PropTypes.number,
};

export default CustomLineChart;
