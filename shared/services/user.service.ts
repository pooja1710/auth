import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { JwtService } from './jwt.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, ResponseContentType } from '@angular/http';
import { Client } from '../models/client.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
@Injectable()
export class UserService {
  users: any;
  user: User;
  forgetpassword: boolean;
  profileTitle: string;
  // clientmaster ={
  //   logo:{
  //     clientmaster:'practice',
  //     uploadimg:[]
  //   },
  //   background:[],
  //   carefamily:[],
  //   hosp:[],
  //   snfmember:[],
  //   emr:false,
  // }
  constructor(private apiService: ApiService, private jwtService: JwtService, private http: Http) { }

  public currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  clientMasterId: number = 0;

  private clientUserSubject = new BehaviorSubject<Client>(new Client());
  public clientUser = this.clientUserSubject.asObservable().distinctUntilChanged();


  clearSession() {
    this.jwtService.destroyToken();
    this.jwtService.destroygetUserAccountId();
    this.currentUserSubject.next(new User());
    this.isAuthenticatedSubject.next(false);
    window.localStorage.clear();
  }

  populate() {
    if (this.jwtService.getToken()) {
      this.apiService.post('/api/getsession', window.localStorage['jwtToken'])
        .subscribe(
          data => {
            if (data.item) {
              //this.user = data;
              this.setAuth(data);
            }
          },
        );
    }
  }
//Login Credentials
  attemptAuth(credentials): Observable<User> {
    return this.apiService.post('/session', credentials)
      .map(
        data => {
          this.users = data;
          // console.log("auth",data)
          // console.log(data)
          this.setAuth(data);
          // this.setdata(data.item.clientMasterId);
          return data;
        }

      );
  }

  //user services  groupName _ name 
  getsessionDCCP(token:any) {
    return this.apiService.post(`/api/getsession`, token);
  }
 

  

  //Set Authentication
  setAuth(user: User) {

    this.jwtService.saveToken(user.item.token);
    this.jwtService.saveUserAccountId(user.item.userId);

    // Set current user data into observable
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  setClient(client: Client) {
    // Set current user data into observable
    this.clientUserSubject.next(client);
  }
  datacm: any;

  getdata(ClientMasterId: any) {
    return this.apiService.get(`/api/v1/client/getclientmasterbyid/${ClientMasterId}`)
      .map(
        data => {
          if (data) {
            this.datacm = data
            this.setClient(this.datacm);
            return data;
          }
        })
  }


  setdata(ClientMasterId: any) {
    return this.apiService.get(`/api/v1/client/getclientmasterbyid/${ClientMasterId}`)
      .subscribe(
        data => {
          // data.clientData = this.clientmaster
          console.log(data)
          this.setClient(data);
          return data;
        })
  }



/* Super Admin - Client List - Statrt */
getClientListData() {
  return this.apiService.get("/client/clientlist").map(
      res => {
        return res;
      },
      err => {
        console.log('Error occured');
      }
    );
}
/* Super Admin - Client List -end */


/* All Client List - Statrt */

getMyClientUserList(clientId) {
  return this.apiService.get("/dashboard/alluserlists/" + clientId)
    .map(
      res => {
        return res; 
      },
      err => {
        console.log('Error occured');
      }
    );
}

/* All Client List - Statrt */














  ///////////////////////////////ADMIN SERVICES//////////////////////////////////
  /* Get Client Hospital Details all Record Based on Admin - Start */ // Client Hospital list 
  getHospitalAllData() {
    return this.apiService.get("/api/v1/client/getclientmasterbyAdmin")

      .map(
        res => {
          return res;
          // this.data$.next(res);
        },
        err => {
          console.log('Error occured');
        }
      );


  }
  /* Get Client Hospital Details all Record Based on Admin - END */

  /* Get Mode Based Records  : HOSPITAL(H) & Practice(P) - Start */
  getHospitalData(mode, userGroupId) {

    return this.apiService.get("/api/v1/client/getclientmasterbyAdmin/" + mode + "/" + userGroupId)
      .map(
        res => {
          return res;
          // this.data$.next(res);
        },
        err => {
          console.log('Error occured');
        }
      );
  }


  getMyClientMappingList(userGroupId) {
    return this.apiService.get("/api/v1/client/getMyClientsbyClientManager/" + userGroupId)
      .map(
        res => {
          return res;
          // this.data$.next(res);
        },
        err => {
          console.log('Error occured');
        }
      );
  }


  /* Get Mode Based Records  : HOSPITAL(H) & Practice(P) - END */


  /* ADD New Client Insert  - Start */
  addNewClientOnBoarding(newClientDetails) {
    return this.apiService
      .post("/api/v1/client/saveClientMaster", newClientDetails)
      .map(clientdata => {
        return clientdata;
      });
  }
  /* ADD New Client Insert  - End */

  getclientmangerlist() {
    return this.apiService.get(`/api/v1/client/getclientmangerlist`);
  }

  ///////////////////////////////ADMIN SERVICES//////////////////////////////////




  ///////////////////////////////USER SERVICES//////////////////////////////////
  //carePlan page
  getCareFamilyByClientMaster(ClientMasterId: any) {
    return this.apiService.get(`/api/v1/client/getCareFamilyByClientMaster/${ClientMasterId}`);
  }
  getMyToDos(ClientMasterId: any, patTrackingType: any) {
    return this.apiService.get(`/api/v1/client/getMyToDos/${ClientMasterId}/${patTrackingType}`);
  }
  getCareFamilyGroup() {
    return this.apiService.post(`/api/v1/client/getCareFamilyGroup`);
  }

  getCareFamilyGroupByUserType(mode) {
    return this.apiService.post(`/api/v1/client/getCareFamilyGroupByGroup/${mode}`);
  }

  activitiesList(clientMasterId, inPatient, outPatient) {
    return this.apiService.get(`/api/v1/client/getAllSwfType?clientMasterId=` + clientMasterId + "&inPatient=" + inPatient + "&outPatient=" + outPatient);
  }

  getCareFamilyByRole(Role, ClientMasterId, sid): Observable<any> {
    let self = this;
    return self.apiService.post('/api/v1/client/getCareFamilyByRoleIdAndClientId?RoleId=' + Role + '&ClientMasterId=' + ClientMasterId + '&SubListId=' + sid);
    // return self.apiService.post('/api/v1/client/getCareFamilyByRole',Role)
  }

  getCareFamilyBySubID(Role, ClientMasterId, sid) {
    let self = this;
    return self.apiService.post('/api/v1/client/getCareFamilyByRoleIdAndSLIdAndClientId?RoleId=' + Role + '&ClientMasterId=' + ClientMasterId + '&SubListId=' + sid);
  }
  
  deleteClientById(clientMasterId) {
    return this.apiService.post(`/api/v1/client/deleteClientById?clientMasterId=` + clientMasterId);
  }

  saveClientCareFamily(clientMasterId: any, data) {
    return this.apiService.post(`/api/v1/client/saveClientCareFamily/{clientMasterId}?clientMasterId=` + clientMasterId, data);
  }

  getLatestCareFamilyByClientMaster(ClientMasterId: any, Count) {
    return this.apiService.get(`/api/v1/client/getLatestCareFamilyByClientMaster/${ClientMasterId}/${Count}`);
  }

  getPacGroup() {
    return this.apiService.post(`/api/v1/client/getPacGroup`);
  }
  getPacByRoleId(RoleId: any, clientMasterID: any) {
    return this.apiService.get(`/api/v1/client/getPacByRoleIdAndClientId/${RoleId}/${clientMasterID}`);
  }
  getAcureCareFilterDetails(id: any, data: any) {
    return this.apiService.post(`/api/v1/client/getAcureCareFilterDetails?id=` + id, data);
  }
  saveMyToDos(ClientMasterId: any, data) {
    return this.apiService.post(`/api/v1/client/saveMyToDos/${ClientMasterId}`, data);
  }



  /* Edit Client list  - Start */
  editClientOnBoarding(editdata) {
    //  alert("ClientMasterId : " + editdata);
    return this.apiService.get("/api/v1/client/getclientmasterbyid/" + editdata)
      .map(
        res => {
          //alert("Edit data===> :"+JSON.stringify(res));
          return res;
        },
        err => {
          console.log('Error occured');
        }
      );

  }
  /* Edit Client list  - end */



  /* Update Client data  - Start */
  updateClientOnBoarding(ClientMasterId, Json) {
    // alert("Update step-one(user service) : " +JSON.stringify(ClientMasterId));
    return this.apiService.post("/api/v1/client/updateClientMasterByClientMasterId?clientMasterId=" + ClientMasterId, Json)
      .map(updatedata => {
        return updatedata;
      });
  }
  /* Update Client data  - End */



  /*  savePAC(ClientMasterId: any, data) {
     return this.apiService.post(`/api/v1/client/savePAC/{clientMasterId}?clientMasterId=` + ClientMasterId, data);
   } */

  ///image upload

  imageUpload(ClientMasterId: any, data) {
    return this.apiService.post(`/api/v1/client/uploadImageByClient/${ClientMasterId}`, data);
  }


  //Dashboard Acute Care Facilities List
  getAcuteCareFacilities(ClientMasterId: String) {
    return this.apiService.get(`/api/v1/client/getLatestPacByClientMaster/${ClientMasterId}`);
  }


  //Dashboard get client details
  getUserProfileDetails(ClientMasterId: String) {
    return this.apiService.get(`/api/v1/client/getclientmasterbyid/${ClientMasterId}`);
  }


  //client Logo Bg Image Upload
  uploadLogoBgImage(ClientMasterId: String, data) {
    return this.apiService.post(`/api/v1/client/uploadImageByClient/${ClientMasterId}`, data);
  }
  deletePAC(PacId: any, ClientMasterId: any) {
    return this.apiService.post(`/api/v1/client/deletePAC/{PacId}/{clientMasterId}?PacId=${PacId}&ClientMasterId=${ClientMasterId}`, PacId);
  }

  //Update New Password
  updateNewPassword(randomID: String, newPassword: String, confirmPassword: String) {
    return this.apiService.post(`/api/updatenewpassword/${randomID}/${newPassword}/${confirmPassword}`);
  }
  //Update Profile Details
  updateProfileDetails(clientMasterID: String, data) {

    return this.apiService.post(`/api/v1/client/updateProfileByUserAccount`, data);
  }
  //reset password
  usermailReset(email) {

    return this.apiService.post(`/api/resetpassword?email=${email}`);
  }
  //change password
  userChangepassword(random, password, changepassword) {

    return this.apiService.post(`/api/updatenewpassword?randId=${random}&newPassword=${password}&confirmPassword=${changepassword}`);
  }
  //get CareFamilylist 

  getCareFamilySummaryList(ClientMasterId: String) {
    return this.apiService.get(`/api/v1/client/getLatestCareFamilyByClientMaster/${ClientMasterId}/10`);
  }

  //Mytodos confiuration

  updateMyToDosById(MyToDoId: any, myToDoData: any, trackingtype: any) {
    return this.apiService.post(`/api/v1/client/updateMyToDosById?MyToDoId=` + MyToDoId + "&patTrackingType=" + trackingtype, myToDoData);
  }

  //Upload Profile Image 

  uploadProfileImage(ClientMasterId: String, image64Str: String) {
    return this.apiService.post(`/api/v1/client/uploadImageByCareFamily/{clientMasterId}?clientMasterId=${ClientMasterId}`, image64Str);
  }

  addNewUser(ClientMasterId: any, data) {
    return this.apiService.post(`/api/v1/client/saveClientCareFamily/{clientMasterId}?clientMasterId=` + ClientMasterId, data);
  }


  getCareFamilyByRoleIdAndSLId(Role, subId, clientID): Observable<any> {
    let self = this;
    return self.apiService.post('/api/v1/client/getCareFamilyByRoleIdAndSLId?ClientMasterId=' + clientID + '&RoleId=' + Role + '&SubListId=' + subId)
    // return self.apiService.post('/api/v1/client/getCareFamilyByRole',Role)
  }

  getServiceLine() {
    let self = this;
    return self.apiService.get('/api/v1/client/getAllServiceLine')

  }


  savePAC(clientMasterID: String, data) {
    return this.apiService.post(`/api/v1/client/savePAC?clientMasterId=` + clientMasterID, data);
  }

  uploadUserProfileImage(userclientID: any, data) {
    return this.apiService.post(`/api/v1/client/uploadImageByUserAccount?userAccountId=` + userclientID, data);
  }


  /* imageUpload(ClientMasterId: any, data) {
    return this.apiService.post(`/api/v1/client/uploadImageByClient/{clientMasterId}?clientMasterId=` + ClientMasterId, data);
  } */


  updateProfilePassword(oldPassword: String, newPassword: String) {
    return this.apiService.post(`/api/v1/client/updateProfilePasswordByUserAccount?oldPassword=${oldPassword}&newPassword=${newPassword}`, null);
  }


  /* Start - Status Details */
  getSetupStatus(ClientMasterId: any) {
    return this.apiService.get(`/api/v1/client/getSetupStatusByClientMasterId/${ClientMasterId}`);
  }

  updateSetupStatus(ClientMasterId, Json) {
    return this.apiService.post("/api/v1/client/updatesetupstatus?clientMasterId=" + ClientMasterId, Json)
      .map(statusUpdate => {
        return statusUpdate;
      });
  }

  /* End - Status Details */

  /* Auto Complete Functionlity Start **/
  getFacilityNameForAutoComplete(faclityname: String, id: String) {
    return this.apiService.get(`/api/v1/client/getAcureCareFilterDetails?facilityName=${faclityname}&id=${id}`);
  }

  // Getting NPIID for autocomplete add user
  getHospitalListByNPIId(id) {
    return this.apiService.get('/api/v1/client/getHospitalListByNPIId?NPIId=' + id)
  }


  /* SNF BY NPIID */

  getSNFBYNPIID(npiid: any) {
    return this.apiService.get(`/api/v1/client/getSNFListByNPIId?NPIId=` + npiid);
  }

  /* Home Healtjh BY NPIID */

  getHomeHealthBYNPIID(npiid: any) {
    return this.apiService.get(`/api/v1/client/getHomeHealthListByNPIId?NPIId=` + npiid);
  }


  /* Acute Rehav BY NPIID */
  getAcuteRehabBYNPIID(npiid: any) {
    return this.apiService.get(`/api/v1/client/getAcuteRehabListByNPIId?NPIId=` + npiid);
  }

  /* OOPT NPIID */

  getOOPTBYNPIID(npiid: any) {
    return this.apiService.get(`/api/v1/client/getOPPTListByNPIId?NPIId=` + npiid);
  }


  /** Status Changes for RecoveryCOACH Team */
  getClientMasterStatus(clientMasterID: any) {
    return this.apiService.get(`/api/v1/client/getClientMasterStatus?clientMasterId=` + clientMasterID);
  }

  updateClientMasterStatus(clientMasterID: any, status: any) {
    return this.apiService.get(`/api/v1/client/UpdateClientMasterStatus?clientMasterId=${clientMasterID}&status=${status}`);
  }

  getSOSDetails() {
    return this.apiService.get(`/api/v1/client/getUserAccountSOSDetails`);
  }
  getClientSiteOfService(clientMasterId) {
    return this.apiService.get(`/api/v1/client/getClientSiteOfService/${clientMasterId}`);
  }
  updateClientSiteOfService(clientMasterId, clientSOSList) {
    return this.apiService.post(`/api/v1/client/updateClientSiteOfService/${clientMasterId}`, clientSOSList);
  }

  getcareFamilybyId(ClientMasterId, UserAccountId, careFamilyId) {
    return this.apiService.get(`/api/v1/client/getCareFamilyByClientMaster?ClientMasterId=${ClientMasterId}&UserAccountId=${UserAccountId}&careFamilyId=${careFamilyId}`);
  }

  saveSWFType(clientMasterID, json, inPatient, outPatient) {
    return this.apiService.post(`/api/v1/client/saveSwfType?clientMasterId=` + clientMasterID + "&inPatient=" + inPatient + "&outPatient=" + outPatient, json);
  }

  updateUserAccount(careFamilyId, json) {
    return this.apiService.post(`/api/v1/client/updateCareFamilyById?careFamilyId=` + careFamilyId, json);
  }

  deleteCareFamilyById(careFamilyId: any) {
    return this.apiService.post(`/api/v1/client/deleteCareFamilyById?careFamilyId=` + careFamilyId);
  }

  launchDataToRCAPI(clientMasterID: any, stage: any) {
    return this.apiService.get(`/api/v1/client/LaunchToRC/${clientMasterID}?StageOrProd=${stage}`);
  }

  getrcURL() {
    return this.apiService.get('/api/v1/reports/GenerateTokenToAccessRcApp')
      .map(data => data);
  }
  senttocken(Tokenidset): Observable<User> {
    return this.apiService.post('/api/validateTokenForRCAppAccess?tokenId=' + Tokenidset)
      .map(
        data => {
          return data;
        }

      );
  }
  synDataToRCAPI(clientMasterID: any) {
    return this.apiService.get(`api/v1/client/Sync/${clientMasterID}`);
  }


  getAuditLog(clientMasterID: any) {
    return this.apiService.get(`/api/v1/client/getUserActivitiesByClient/${clientMasterID}`);
  }

  //General Configuration Start Here
  addgeneralconfig(newGeneralConfig, type, patTrackingType) {
    return this.apiService
      .post(`/api/v1/client/saveGeneralConfiguration?type=${type}&patTrackingType=${patTrackingType}`, newGeneralConfig)
      .map(data => {
        return data;
      });
  }
  getGeneralConfig(clientMasterId: any, patTrackingType: any) {
    return this.apiService.get(`/api/v1/client/getGeneralConfigurationDetails?ClientMasterId=` + clientMasterId + "&patTrackingType=" + patTrackingType);
  }

  //Client Information Start Here
  getClientInformation(clientMasterId) {
    return this.apiService.get(`/api/v1/client/getClientInformationDetails?ClientMasterId=` + clientMasterId);
  }

  addClientInformation(data, type) {
    return this.apiService
      .post(`/api/v1/client/saveClientInformation?type=${type}`, data)
      .map(data => {
        return data;
      });
  }
  removeSecondAddressOfClientInfo(cmId): Observable<String> {
    return this.apiService.put('/api/v1/client/removeSecondAddressOfClientInfo?cmId=' + cmId)
      .map(data => { return data; });
  }
  getNotificationListAPI(userAccountId) {
    return this.apiService.get(`/api/v1/client/getNotificationMasterByUserAccountId/${userAccountId}`);
  }

  notificationLogAPI(clientMasterID) {
    return this.apiService.get(`/api/v1/client/saveNotificationMasterByClient/${clientMasterID}`);
  }

  UpdateNotificationAPI(userAccountId) {
    return this.apiService.get(`/api/v1/client/UpdateNotificationMasterByUserAccountId/${userAccountId}`);
  }

  getSurgeonProcedureList(clientMasterId) {
    return this.apiService.get(`/api/v1/client/getClientServiceLineList/${clientMasterId}`);
  }


  getSOSByNPI(npiNo) {
    return this.apiService.get(`/api/v1/client/getHospitalByNPI?npiNo=${npiNo}`);
  }


  getSOSCCCNFamilyGroup() {
    return this.apiService.get(`/api/v1/client/getHospitalForSOS`);
  }

  verifyUserAccountAddress(emailAddress) {
    return this.apiService.get(`/api/v1/client/verifyUserAccountAddress?address=${emailAddress}`);
  }


  fetchCountryCode() {
    return this.apiService.get(`/api/v1/client/fetchCountryCode`);
  }

  ////////////design builder start here //////////////

  getformproduct(formProductId: any) {
    return this.apiService.post(`/api/v1/document/form/getformproduct/${formProductId}`);
  }
  getformproductList() {
    return this.apiService.post(`/api/v1/document/form/getformproductList`);
  }

  updateString;
  //Update JSON Template API Service
  updateJSONTemplate(updateJSONTemplate): Observable<String> {
    return this.apiService.put('/api/v1/document/updateJsonTemplate', updateJSONTemplate)
      .map(
        data => {
          this.updateString = data;
          return data;
        }

      );
  }
  updateSVGString;
  updateSVGTemplate(updateSVGTemplate): Observable<String> {
    return this.apiService.put('/api/v1/document/updateSVGTemplate', updateSVGTemplate)
      .map(
        data => {
          this.updateSVGString = data;
          return data;
        }

      );
  }

  getformproductLocation() {
    return this.apiService.post(`/api/v1/document/form/getformproductLocation`);
  }
  addformproduct(formProductData: any) {
    return this.apiService.post(`/api/v1/document/addformproduct`, formProductData);
  }
  deleteFormProduct(FormProductId: any) {
    return this.apiService.post(`/api/v1/document/deleteFormProduct/${FormProductId}`);
  }
  ////////////design builder start here //////////////

  getPatientTrackingList(clientMasterId) {
    return this.apiService.get(`/api/v1/client/getPatientTrackingType/` + clientMasterId);
  }
  ///PAassessment
  getSurveyResult(surveyId) {
    return this.apiService.get(`/api/v2/survey/getsurvey?surveyId=` + surveyId);
  }

}


