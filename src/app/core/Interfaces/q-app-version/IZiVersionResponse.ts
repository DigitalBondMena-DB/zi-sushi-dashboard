export interface IZiVersion {
  id: number;
  apple_version: string;
  android_version: string;
  importance_status: number;
  created_at: string;
  updated_at: string;
}

export interface IZiVersionResponse {
  ZiVersion: IZiVersion;
}
