export class Client {

  //     logo: {
  //         clientmaster: string;
  //         uploadimg: any[];
  //     };
  //     background: any[];
  //     carefamily: any[];
  //     hosp:any[];
  //     snfmember: any[];
  //     emr: boolean;
  //   }
  //   {
  clientData: {
    clientData: [
      {
        careFamilyId: number;
        clientName: string;
        firstName: string;
        role: string;
        gender: string;
        email: string;
        phone: string;
        qualification: string;
        aboutMe: string;
        hobbies: string;
        npi: string;
        uploadImage: string;
        primary: string;
      }
    ]
  }
  clientMasterId: number;
  clientMasterName: string;
  userName: string;
  mode: string;
  userAccountId: number
  website: string;
  servicelines: string;
  usageModel: string;
  EMRIntegrationRequired: number
  EMRProvider: string;
  mailTo: string;
  enrollStatusName: string;
  enrollStatusCode: string;
  notes: string;
  backgroundpath:string;
  status: string;
  cmsuid: number
  logicItem: string;
  logopath: string;
  medicareId: number
  phone: string;
}