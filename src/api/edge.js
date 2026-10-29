import http from './http'
import { requestOrMock } from './client'
import { getPackDetail, getPackEstimate, getPacks } from '@/mock/cluster'

function unwrap(payload) {
  if (payload && typeof payload === 'object' && 'code' in payload && payload.code !== 200) {
    throw new Error(payload.message || '接口返回失败')
  }
  return payload?.result ?? payload
}

function post(path) {
  return http.post(path, {}).then(unwrap)
}

function num(value, digits) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '--'
  return number.toFixed(digits)
}

function pairs(xs, ys) {
  const xList = xs || []
  const yList = ys || []
  const count = Math.min(xList.length, yList.length)
  return Array.from({ length: count }, (_, index) => [Number(xList[index]), Number(yList[index])])
}

function cycleCategories(actual, predict) {
  const count = Math.max(actual.length, predict.length)
  return Array.from({ length: count }, (_, index) => String(index + 1))
}

function mapAlarm(item) {
  if (!item || typeof item !== 'object') {
    return { name: String(item || '告警'), time: '', level: 'warning' }
  }
  const level = item.level === '告警' ? 'critical' : item.level === '提醒' ? 'warning' : 'normal'
  return {
    name: item.content || item.name || item.deviceName || '告警',
    time: item.start || item.time || '',
    level
  }
}

function mapPacks(list) {
  return (list || []).map((item) => ({
    id: String(item.packId),
    title: `PACK${item.packId}`,
    soc: `${num(item.SOC, 1)} %`,
    totalV: `${num(item.Vol, 2)} V`,
    totalI: `${num(item.Cur, 1)} A`,
    cellMax: `${num(item.CellVolMax, 3)} V`,
    cellMin: `${num(item.CellVolMin, 3)} V`,
    tempMax: `${num(item.TempMax, 1)} ℃`,
    tempMin: `${num(item.TempMin, 1)} ℃`
  }))
}

function mapDetail(clusterId, packId, result) {
  const row = result?.realData?.[0]
  if (!row) throw new Error('没有该包的实时数据')
  const current = Number(row.Cur)
  return {
    clusterId: String(clusterId),
    packId: String(packId),
    status: '',
    updatedAt: '',
    voltage: { value: Number(row.Vol), min: 0, max: 200, unit: 'V', color: '#4caf50' },
    current: {
      value: current,
      gauge: Math.abs(current),
      min: 0,
      max: 10,
      unit: 'A',
      color: '#29b6f6'
    },
    soc: { value: Number(row.SOC), min: 0, max: 100, unit: '%', color: '#4caf50' },
    cellVoltage: {
      times: row.TimeList || [],
      max: Number(row.CellVolMax),
      min: Number(row.CellVolMin),
      maxSeries: row.CellVolMaxList || [],
      minSeries: row.CellVolMinList || []
    },
    cellTemperature: {
      times: row.TimeList || [],
      max: Number(row.TempMax),
      min: Number(row.TempMin),
      maxSeries: row.TempMaxList || [],
      minSeries: row.TempMinList || []
    }
  }
}

function mapEstimate(clusterId, packId, result) {
  const alg = result?.algData
  if (!alg) throw new Error('没有该包的算法数据')
  const socList = alg.SOCList || []
  const volFlags = alg.IncCellVolList || []
  const tempFlags = alg.IncTempList || []
  const vq = alg.vqData || {}
  const cap = alg.capData || {}
  return {
    clusterId: String(clusterId),
    packId: String(packId),
    soe: { actual: Number(alg.SOEReal), predict: Number(alg.SOEPre) },
    sopDischarge: {
      actual: Number(alg.SOPDiscargeReal ?? alg.SOPDischargeReal),
      predict: Number(alg.SOPDischargePre)
    },
    sopCharge: { actual: Number(alg.SOPChargeReal), predict: Number(alg.SOPChargePre) },
    soc: { actual: Number(alg.SOCReal), predict: Number(alg.SOCPre) },
    soh: { actual: Number(alg.SOHReal), predict: Number(alg.SOHPre) },
    cells: socList.map((soc, index) => ({
      index: index + 1,
      soc: Number(soc),
      voltageAbnormal: Number(volFlags[index]) === 0,
      temperatureAbnormal: Number(tempFlags[index]) === 0
    })),
    ocv: {
      actualPairs: pairs(vq.Q_Real_List, vq.V_Real_List),
      predictPairs: pairs(vq.Q_Pre_List, vq.V_Pre_List),
      score: Number(vq.mape)
    },
    capacity: {
      categories: cycleCategories(cap.True_List || [], cap.Pre_List || []),
      actual: cap.True_List || [],
      predict: cap.Pre_List || [],
      mape: Number(cap.mape),
      showXAxis: true
    },
    warnings: (alg.AlarmList || []).map(mapAlarm),
    alarmSummary: typeof alg.strAlarm === 'string' ? alg.strAlarm : ''
  }
}

function mockDetail(clusterId, packId) {
  const detail = getPackDetail(clusterId, packId)
  return {
    ...detail,
    current: { ...detail.current, gauge: detail.current.value }
  }
}

function mockEstimate(clusterId, packId) {
  const estimate = getPackEstimate(clusterId, packId)
  return {
    ...estimate,
    ocv: {
      actualPairs: estimate.ocv.categories.map((q, index) => [
        Number(q),
        estimate.ocv.actual[index]
      ]),
      predictPairs: estimate.ocv.categories.map((q, index) => [
        Number(q),
        estimate.ocv.predict[index]
      ]),
      score: estimate.ocv.score
    },
    capacity: { ...estimate.capacity, showXAxis: true }
  }
}

export function loadPacks(clusterId) {
  return requestOrMock(
    () => getPacks(clusterId),
    () => post(`/v1/Data/packList/${clusterId}`).then((result) => mapPacks(result?.packDataList))
  )
}

export function loadPackDetail(clusterId, packId) {
  return requestOrMock(
    () => mockDetail(clusterId, packId),
    () =>
      post(`/v1/Data/realData/${clusterId}/${packId}`).then((result) =>
        mapDetail(clusterId, packId, result)
      )
  )
}

function mapCellCurves(vqResult, capResult) {
  const vq = vqResult?.vqData || {}
  const cap = capResult?.capData || {}
  return {
    ocv: {
      actualPairs: pairs(vq.Q_Real_List, vq.V_Real_List),
      predictPairs: pairs(vq.Q_Pre_List, vq.V_Pre_List),
      score: Number(vq.mape)
    },
    capacity: {
      categories: cycleCategories(cap.True_List || [], cap.Pre_List || []),
      actual: cap.True_List || [],
      predict: cap.Pre_List || [],
      mape: Number(cap.mape),
      showXAxis: true
    }
  }
}

function mockCellCurves(clusterId, packId, cellId) {
  const estimate = mockEstimate(clusterId, packId)
  const offset = Number(cellId) - 1
  return {
    ocv: {
      actualPairs: estimate.ocv.actualPairs.map(([q, voltage]) => [
        q,
        Number((voltage + offset * 0.002).toFixed(3))
      ]),
      predictPairs: estimate.ocv.predictPairs.map(([q, voltage]) => [
        q,
        Number((voltage + offset * 0.002).toFixed(3))
      ]),
      score: estimate.ocv.score
    },
    capacity: {
      ...estimate.capacity,
      actual: estimate.capacity.actual.map((value) => Number((value - offset * 0.15).toFixed(2))),
      predict: estimate.capacity.predict.map((value) => Number((value - offset * 0.15).toFixed(2)))
    }
  }
}

export function loadPackEstimate(clusterId, packId) {
  return requestOrMock(
    () => mockEstimate(clusterId, packId),
    () =>
      post(`/v1/Data/algData/${clusterId}/${packId}`).then((result) =>
        mapEstimate(clusterId, packId, result)
      )
  )
}

export function loadCellCurves(clusterId, packId, cellId) {
  return requestOrMock(
    () => mockCellCurves(clusterId, packId, cellId),
    () =>
      Promise.all([
        post(`/v1/Data/vqData/${clusterId}/${packId}/${cellId}`),
        post(`/v1/Data/capData/${clusterId}/${packId}/${cellId}`)
      ]).then(([vq, cap]) => mapCellCurves(vq, cap))
  )
}
