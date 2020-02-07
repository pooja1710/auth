import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {
     getToken(): String {
        return window.localStorage['jwtToken'];
      }

      saveToken(token: String) {
        window.localStorage['jwtToken'] = token;
      } 

      getUserAccountId(): String {
        return window.localStorage['useraccountid'];
      }

      saveUserAccountId(useraccountid: number) {

        window.localStorage['useraccountid'] = String(useraccountid);
      }


      destroyToken() {
        window.localStorage.removeItem('jwtToken');
      }
      destroygetUserAccountId(){
        window.localStorage.removeItem('useraccountid');
      }
     

}