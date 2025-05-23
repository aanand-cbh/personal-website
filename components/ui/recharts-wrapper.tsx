"use client"

import React from "react"
import * as RechartsPrimitive from "recharts"

// Wrapper components for Recharts that satisfy MDX component type requirements
export const LineChart = (props: React.ComponentProps<typeof RechartsPrimitive.LineChart>) => (
  <RechartsPrimitive.LineChart {...props} />
)

export const BarChart = (props: React.ComponentProps<typeof RechartsPrimitive.BarChart>) => (
  <RechartsPrimitive.BarChart {...props} />
)

export const PieChart = (props: React.ComponentProps<typeof RechartsPrimitive.PieChart>) => (
  <RechartsPrimitive.PieChart {...props} />
)

export const AreaChart = (props: React.ComponentProps<typeof RechartsPrimitive.AreaChart>) => (
  <RechartsPrimitive.AreaChart {...props} />
)

export const CartesianGrid = (props: React.ComponentProps<typeof RechartsPrimitive.CartesianGrid>) => (
  <RechartsPrimitive.CartesianGrid {...props} />
)

export const XAxis = (props: React.ComponentProps<typeof RechartsPrimitive.XAxis>) => (
  <RechartsPrimitive.XAxis {...props} />
)

export const YAxis = (props: React.ComponentProps<typeof RechartsPrimitive.YAxis>) => (
  <RechartsPrimitive.YAxis {...props} />
)

export const Tooltip = (props: React.ComponentProps<typeof RechartsPrimitive.Tooltip>) => (
  <RechartsPrimitive.Tooltip {...props} />
)

export const Legend = (props: React.ComponentProps<typeof RechartsPrimitive.Legend>) => (
  <RechartsPrimitive.Legend {...props} />
)

export const Line = (props: React.ComponentProps<typeof RechartsPrimitive.Line>) => (
  <RechartsPrimitive.Line {...props} />
)

export const Bar = (props: React.ComponentProps<typeof RechartsPrimitive.Bar>) => (
  <RechartsPrimitive.Bar {...props} />
)

export const Pie = (props: React.ComponentProps<typeof RechartsPrimitive.Pie>) => (
  <RechartsPrimitive.Pie {...props} />
)

export const Area = (props: React.ComponentProps<typeof RechartsPrimitive.Area>) => (
  <RechartsPrimitive.Area {...props} />
)

export const Cell = (props: React.ComponentProps<typeof RechartsPrimitive.Cell>) => (
  <RechartsPrimitive.Cell {...props} />
) 