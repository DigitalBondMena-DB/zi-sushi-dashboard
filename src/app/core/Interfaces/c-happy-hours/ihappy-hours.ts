export interface IHappyHoursResponse {
    success: boolean
  data: IHappyHours[]
}

export interface IHappyHours {
  id: number
  day: string
  start_time: string
  end_time: string
  discount_percentage: number
  is_active: number 
  created_at: string
  updated_at: string
}

export interface IHappyHoursToggleStatusResponse {
  success: boolean
  message: string
  data: IHappyHours
}