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
  caregiver_id: number
  caregiver_name: string
  time: string
  event: RecordEvent
}

export interface LoginResponse {
  caregiver_id: number
}

export interface CreateRecordRequest {
  caregiver_id: number
  time: string
  event: RecordEvent
}

export interface UpdateRecordRequest {
  record_id: number
  time: string
  event: RecordEvent
}

export const api = {
  login: async (name: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/caregivers/login', {
      caregiver_name: name,
    })
    return response.data
  },

  getRecords: async (caregiverId?: number): Promise<Record[]> => {
    const url = caregiverId 
      ? `/api/records?caregiver_id=${caregiverId}`
      : '/api/records'
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
    })
    return response.data
  },

  deleteRecord: async (recordId: number): Promise<{ record_id: number }> => {
    const response = await apiClient.delete<{ record_id: number }>(`/api/records/${recordId}`)
    return response.data
  },
}

export default apiClient
