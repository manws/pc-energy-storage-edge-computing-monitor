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

const OCV_Q = [0, 40, 80, 120, 160, 200, 240, 280]
const FUTURE_CYCLES = [0, 100, 200, 300, 400, 500, 600, 800]

export const PACK_COUNT = 8
export const CELL_COUNT = 52

const CLUSTERS = {
  1: {
    status: '正常',
    voltage: 712.5,
    current: 128.6,
    soc: 86.2,
    cellMax: 3.412,
    cellMin: 3.398,
    tempMax: 32.5,
    tempMin: 28.1,
    soe: 29.8,
    sopDischarge: 22.8,
    sopCharge: 19.6
  },
  2: {
    status: '正常',
    voltage: 709.8,
    current: 132.1,
    soc: 84.7,
    cellMax: 3.408,
    cellMin: 3.391,
    tempMax: 33.1,
    tempMin: 27.9,
    soe: 28.9,
    sopDischarge: 22.0,
    sopCharge: 18.9
  },
  3: {
    status: '正常',
    voltage: 714.2,
    current: 119.4,
    soc: 88.0,
    cellMax: 3.415,
    cellMin: 3.402,
    tempMax: 31.8,
    tempMin: 28.4,
    soe: 30.9,
    sopDischarge: 21.1,
    sopCharge: 20.3
  },
  4: {
    status: '预警',
    voltage: 705.6,
    current: 141.7,
    soc: 79.3,
    cellMax: 3.401,
    cellMin: 3.372,
    tempMax: 35.6,
    tempMin: 29.0,
    soe: 24.8,
    sopDischarge: 19.3,
    sopCharge: 17.7
  },
  5: {
    status: '正常',
    voltage: 711.9,
    current: 126.3,
    soc: 85.5,
    cellMax: 3.41,
    cellMin: 3.396,
    tempMax: 32.0,
    tempMin: 27.6,
    soe: 29.3,
    sopDischarge: 22.5,
    sopCharge: 19.8
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

function near(rand, value, ratio, digits) {
  return Number((value * (1 + (rand() - 0.42) * ratio)).toFixed(digits))
}

function pick(rand, total, count) {
  const chosen = new Set()
  const safeCount = Math.min(count, total)
  while (chosen.size < safeCount) chosen.add(Math.floor(rand() * total))
  return chosen
}

function clusterOf(id) {
  return CLUSTERS[String(id)] || CLUSTERS[1]
}

function packProfile(clusterId, packId) {
  const cluster = clusterOf(clusterId)
  const index = Math.min(PACK_COUNT, Math.max(1, Number(packId) || 1)) - 1
  const rand = random(Number(clusterId || 1) * 100 + (index + 1) * 17)
  const shift = index - 3.5
  let cellMax = cluster.cellMax + (rand() - 0.5) * 0.006
  let cellMin = cluster.cellMin + (rand() - 0.5) * 0.006
  if (cellMin > cellMax - 0.004) cellMin = cellMax - 0.008
  let tempMax = cluster.tempMax + (rand() - 0.45) * 0.8
  let tempMin = cluster.tempMin + (rand() - 0.5) * 0.5
  if (tempMin > tempMax - 0.4) tempMin = tempMax - 0.8
  const warning = cluster.status === '预警' && (index === 2 || index === 6)
  const demo = String(clusterId) === '1' && index === 0

  return {
    clusterId: String(clusterId || 1),
    packId: String(index + 1),
    status: warning ? '预警' : '正常',
    voltage: Number((cluster.voltage + shift * 1.15 + (rand() - 0.5) * 0.6).toFixed(1)),
    current: Number((cluster.current + shift * 1.2 + (rand() - 0.5)).toFixed(1)),
    soc: Number((cluster.soc + shift * 0.28 + (rand() - 0.5) * 0.4).toFixed(1)),
    cellMax: Number(cellMax.toFixed(3)),
    cellMin: Number(cellMin.toFixed(3)),
    cellMaxNo: 1 + Math.floor(rand() * CELL_COUNT),
    cellMinNo: 1 + Math.floor(rand() * CELL_COUNT),
    tempMax: Number(tempMax.toFixed(1)),
    tempMin: Number(tempMin.toFixed(1)),
    tempMaxNo: 1 + Math.floor(rand() * CELL_COUNT),
    tempMinNo: 1 + Math.floor(rand() * CELL_COUNT),
    soe: Number((cluster.soe + shift * 0.15).toFixed(1)),
    sopDischarge: Number((cluster.sopDischarge + shift * 0.12).toFixed(1)),
    sopCharge: Number((cluster.sopCharge + shift * 0.1).toFixed(1)),
    voltageAbnormal: warning ? 4 : 1 + (index % 3 === 0 ? 1 : 0),
    tempAbnormal: warning ? 3 : index % 4 === 0 ? 1 : 0,
    ocvScore: demo ? 0.32 : Number((0.18 + rand() * 0.28).toFixed(2)),
    mape: demo ? 0.23 : Number((0.12 + rand() * 0.22).toFixed(2)),
    rand
  }
}

export function getClusters() {
  return Object.entries(CLUSTERS).map(([id, cluster]) => ({
    id,
    title: `${id}簇`,
    status: cluster.status
  }))
}

export function getPacks(clusterId) {
  return Array.from({ length: PACK_COUNT }, (_, index) => {
    const pack = packProfile(clusterId, index + 1)
    return {
      id: pack.packId,
      clusterId: pack.clusterId,
      title: `PACK${pack.packId}`,
      status: pack.status,
      totalV: `${pack.voltage.toFixed(1)} V`,
      totalI: `${pack.current.toFixed(1)} A`,
      soc: `${pack.soc.toFixed(1)} %`,
      cellMax: `${pack.cellMax.toFixed(3)} V`,
      cellMin: `${pack.cellMin.toFixed(3)} V`,
      tempMax: `${pack.tempMax.toFixed(1)} ℃`,
      tempMin: `${pack.tempMin.toFixed(1)} ℃`
    }
  })
}

export function getPackDetail(clusterId, packId) {
  const pack = packProfile(clusterId, packId)
  const rand = random(Number(pack.clusterId) * 97 + Number(pack.packId) * 13)
  return {
    clusterId: pack.clusterId,
    packId: pack.packId,
    status: pack.status,
    updatedAt: '14:32:05',
    voltage: { value: pack.voltage, min: 600, max: 750, unit: 'V', color: '#4caf50' },
    current: { value: pack.current, min: 0, max: 200, unit: 'A', color: '#29b6f6' },
    soc: { value: pack.soc, min: 0, max: 100, unit: '%', color: '#4caf50', capacityAh: 280 },
    cellVoltage: {
      times: TIMES,
      maxIndex: pack.cellMaxNo,
      minIndex: pack.cellMinNo,
      max: pack.cellMax,
      min: pack.cellMin,
      maxSeries: wave(rand, pack.cellMax, 0.012, 3),
      minSeries: wave(rand, pack.cellMin, 0.01, 3)
    },
    cellTemperature: {
      times: TIMES,
      maxIndex: pack.tempMaxNo,
      minIndex: pack.tempMinNo,
      max: pack.tempMax,
      min: pack.tempMin,
      maxSeries: wave(rand, pack.tempMax, 1.2, 1),
      minSeries: wave(rand, pack.tempMin, 0.8, 1)
    }
  }
}

function ocvSeries(pack) {
  const rand = random(Number(pack.clusterId) * 211 + Number(pack.packId) * 19)
  const actual = OCV_Q.map((q) =>
    Number((3.22 + (q / 280) * 0.19 + Math.sin(q / 90) * 0.008).toFixed(3))
  )
  const predict = actual.map((value) => near(rand, value, 0.004, 3))
  return { categories: OCV_Q.map(String), actual, predict }
}

function capacitySeries(pack) {
  const rand = random(Number(pack.clusterId) * 307 + Number(pack.packId) * 23)
  const actual = FUTURE_CYCLES.map((cycle, index) => {
    if (index === 0) return 280
    return Number((280 - cycle * 0.018 + Math.sin(cycle / 180) * 0.6).toFixed(2))
  })
  const predict = actual.map((value) => near(rand, value, 0.006, 2))
  return { categories: FUTURE_CYCLES.map(String), actual, predict }
}

export function getPackEstimate(clusterId, packId) {
  const pack = packProfile(clusterId, packId)
  const rand = pack.rand
  const voltageAbnormal = pick(rand, CELL_COUNT, pack.voltageAbnormal)
  const temperatureAbnormal = pick(rand, CELL_COUNT, pack.tempAbnormal)
  const cells = Array.from({ length: CELL_COUNT }, (_, index) => {
    let soc = pack.soc + (rand() - 0.5) * 8
    if (index % 17 === 0) soc = 62 + rand() * 8
    return {
      index: index + 1,
      soc: Number(Math.min(98, Math.max(55, soc)).toFixed(1)),
      voltageAbnormal: voltageAbnormal.has(index),
      temperatureAbnormal: temperatureAbnormal.has(index)
    }
  })
  const predictRand = random(Number(pack.clusterId) * 131 + Number(pack.packId) * 29)

  return {
    clusterId: pack.clusterId,
    packId: pack.packId,
    soe: { actual: pack.soe, predict: near(predictRand, pack.soe, 0.035, 1) },
    sopDischarge: {
      actual: pack.sopDischarge,
      predict: near(predictRand, pack.sopDischarge, 0.04, 1)
    },
    sopCharge: {
      actual: pack.sopCharge,
      predict: near(predictRand, pack.sopCharge, 0.04, 1)
    },
    cells,
    ocv: { ...ocvSeries(pack), score: pack.ocvScore },
    capacity: { ...capacitySeries(pack), mape: pack.mape },
    warnings: [
      { name: `PACK${pack.packId} 单体电压一致性异常`, time: '01-15 14:28:36', level: 'critical' },
      { name: `${pack.clusterId}簇 温度越限预警`, time: '01-15 13:52:10', level: 'warning' },
      { name: '绝缘电阻偏低', time: '01-15 11:04:55', level: 'warning' },
      { name: '内阻异常增大', time: '01-15 09:37:22', level: 'normal' },
      { name: 'SOC 估算偏差超限', time: '01-14 22:15:48', level: 'normal' }
    ]
  }
}
