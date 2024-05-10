export default interface Store {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  key: string;
  name: {
    en: string;
  };
  languages: [];
  distributionChannels: [];
  supplyChannels: [];
  productSelections: [];
  countries: [];
}
