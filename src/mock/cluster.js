const TIMES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30'
]

const CELL_COUNT = 416

const CLUSTERS = {
  1: {
    status: '正常',
    voltage: 712.5,
    current: 128.6,
    soc: 86.2,
    cellMax: 3.412,
    cellMin: 3.398,
    cellMaxNo: 128,
    cellMinNo: 291,
    tempMax: 32.5,
    tempMin: 28.1,
    tempMaxNo: 204,
    tempMinNo: 57,
    soe: 238.6,
    sopDischarge: 182.4,
    sopCharge: 156.8,
    voltageAbnormal: 11,
    tempAbnormal: 6
  },
  2: {
    status: '正常',
    voltage: 709.8,
    current: 132.1,
    soc: 84.7,
    cellMax: 3.408,
    cellMin: 3.391,
    cellMaxNo: 96,
    cellMinNo: 310,
    tempMax: 33.1,
    tempMin: 27.9,
    tempMaxNo: 188,
    tempMinNo: 42,
    soe: 231.4,
    sopDischarge: 176.2,
    sopCharge: 151.0,
    voltageAbnormal: 4,
    tempAbnormal: 2
  },
  3: {
    status: '正常',
    voltage: 714.2,
    current: 119.4,
    soc: 88.0,
    cellMax: 3.415,
    cellMin: 3.402,
    cellMaxNo: 140,
    cellMinNo: 255,
    tempMax: 31.8,
    tempMin: 28.4,
    tempMaxNo: 176,
    tempMinNo: 63,
    soe: 246.8,
    sopDischarge: 168.5,
    sopCharge: 162.3,
    voltageAbnormal: 2,
    tempAbnormal: 1
  },
  4: {
    status: '预警',
    voltage: 705.6,
    current: 141.7,
    soc: 79.3,
    cellMax: 3.401,
    cellMin: 3.372,
    cellMaxNo: 211,
    cellMinNo: 340,
    tempMax: 35.6,
    tempMin: 29.0,
    tempMaxNo: 221,
    tempMinNo: 18,
    soe: 198.7,
    sopDischarge: 154.2,
    sopCharge: 141.6,
    voltageAbnormal: 18,
    tempAbnormal: 9
  },
  5: {
    status: '正常',
    voltage: 711.9,
    current: 126.3,
    soc: 85.5,
    cellMax: 3.41,
    cellMin: 3.396,
    cellMaxNo: 102,
    cellMinNo: 276,
    tempMax: 32.0,
    tempMin: 27.6,
    tempMaxNo: 190,
    tempMinNo: 51,
    soe: 234.1,
    sopDischarge: 179.8,
    sopCharge: 158.4,
    voltageAbnormal: 5,
    tempAbnormal: 3
  }
}

function random(seed) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function wave(rand, end, swing, digits) {
  return TIMES.map((_, index) => {
    if (index === TIMES.length - 1) return end
    const phase = (index / (TIMES.length - 1)) * Math.PI * 2
    const value = end - swing * 0.35 + Math.sin(phase) * swing + (rand() - 0.5) * swing * 0.3
    return Number(value.toFixed(digits))
  })
}

function pick(rand, total, count) {
  const chosen = new Set()
  while (chosen.size < count) chosen.add(Math.floor(rand() * total))
  return chosen
}

function clusterOf(id) {
  return CLUSTERS[String(id)] || CLUSTERS[1]
}

export function getClusterDetail(id) {
  const cluster = clusterOf(id)
  const rand = random(Number(id || 1) * 97)
  return {
    clusterId: String(id || 1),
    status: cluster.status,
    updatedAt: '14:32:05',
    voltage: { value: cluster.voltage, min: 600, max: 750, unit: 'V', color: '#4caf50' },
    current: { value: cluster.current, min: 0, max: 200, unit: 'A', color: '#29b6f6' },
    soc: { value: cluster.soc, min: 0, max: 100, unit: '%', color: '#4caf50', capacityAh: 280 },
    cellVoltage: {
      times: TIMES,
      maxIndex: cluster.cellMaxNo,
      minIndex: cluster.cellMinNo,
      max: cluster.cellMax,
      min: cluster.cellMin,
      maxSeries: wave(rand, cluster.cellMax, 0.012, 3),
      minSeries: wave(rand, cluster.cellMin, 0.01, 3)
    },
    cellTemperature: {
      times: TIMES,
      maxIndex: cluster.tempMaxNo,
      minIndex: cluster.tempMinNo,
      max: cluster.tempMax,
      min: cluster.tempMin,
      maxSeries: wave(rand, cluster.tempMax, 1.2, 1),
      minSeries: wave(rand, cluster.tempMin, 0.8, 1)
    }
  }
}

export function getClusterEstimate(id) {
  const cluster = clusterOf(id)
  const rand = random(Number(id || 1) * 131)
  const voltageAbnormal = pick(rand, CELL_COUNT, cluster.voltageAbnormal)
  const temperatureAbnormal = pick(rand, CELL_COUNT, cluster.tempAbnormal)
  const cells = Array.from({ length: CELL_COUNT }, (_, index) => {
    let soc = cluster.soc + (rand() - 0.48) * 10
    if (index % 53 === 0) soc = 61 + rand() * 6
    else if (index % 29 === 0) soc = 72 + rand() * 6
    return {
      index: index + 1,
      soc: Number(Math.min(98, Math.max(55, soc)).toFixed(1)),
      voltageAbnormal: voltageAbnormal.has(index),
      temperatureAbnormal: temperatureAbnormal.has(index)
    }
  })

  return {
    clusterId: String(id || 1),
    soe: cluster.soe,
    sopDischarge: cluster.sopDischarge,
    sopCharge: cluster.sopCharge,
    cells,
    warnings: [
      { name: '单体电压一致性异常', time: '01-15 14:28:36', level: 'critical' },
      { name: `${id || 1}簇 温度越限预警`, time: '01-15 13:52:10', level: 'warning' },
      { name: '绝缘电阻偏低', time: '01-15 11:04:55', level: 'warning' },
      { name: '内阻异常增大', time: '01-15 09:37:22', level: 'normal' },
      { name: 'SOC 估算偏差超限', time: '01-14 22:15:48', level: 'normal' }
    ]
  }
}
