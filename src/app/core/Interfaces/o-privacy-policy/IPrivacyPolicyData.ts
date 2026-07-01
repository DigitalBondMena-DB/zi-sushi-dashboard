export interface IPrivacyPolicyData {
  PrivacyPolicy: PrivacyPolicy;
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
