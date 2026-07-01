export interface IPrivacyPolicyUpdateResponse {
  PrivacyPolicy: PrivacyPolicy;
  success: string;
}

export interface PrivacyPolicy {
  id: number;
  en_title: string;
  ar_title: string;
  en_text: string;
  ar_text: string;
  created_at: string;
  updated_at: string;
}
