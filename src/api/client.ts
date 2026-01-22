import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Caregiver {
  caregiver_id: number
  caregiver_name: string
}

export type RecordEvent = '餵奶' | '擠奶' | '大便' | '小便'

export interface Record {
  record_id: number
  caregiver_name: string
  time: string
  event: RecordEvent
  notes?: string
}

export interface CreateRecordRequest {
  caregiver_name: string
  time: string
  event: RecordEvent
  notes?: string
}

export interface UpdateRecordRequest {
  record_id: number
  time: string
  event: RecordEvent
  notes?: string
}

export interface Settings {
  feeding_interval: number
  pumping_interval: number
  last_modified_by?: string
  updated_at?: string
}

export const api = {
  getRecords: async (): Promise<Record[]> => {
    const url = '/api/records'
    const response = await apiClient.get<Record[]>(url)
    return response.data
  },

  createRecord: async (data: CreateRecordRequest): Promise<{ record_id: number }> => {
    const response = await apiClient.post<{ record_id: number }>('/api/records', data)
    return response.data
  },

  updateRecord: async (data: UpdateRecordRequest): Promise<{ record_id: number }> => {
    const response = await apiClient.put<{ record_id: number }>(`/api/records/${data.record_id}`, {
      time: data.time,
      event: data.event,
      notes: data.notes,
    })
    return response.data
  },

  deleteRecord: async (recordId: number): Promise<{ record_id: number }> => {
    const response = await apiClient.delete<{ record_id: number }>(`/api/records/${recordId}`)
    return response.data
  },
  getSettings: async (): Promise<Settings> => {
    const response = await apiClient.get<Settings>('/api/settings')
    return response.data
  },
  updateSettings: async (caregiverName: string, data: { feeding_interval: number; pumping_interval: number }): Promise<{ success: boolean }> => {
    const response = await apiClient.put<{ success: boolean }>('/api/settings', {
      ...data,
      caregiver_name: caregiverName
    })
    return response.data
  },
}

export default apiClient
