import { Database } from '../database/database';
import { EnterpriseForm } from '../handlers/create-new-enterprise.handler';
import { Organization } from '../providers/electronic-billing/organization';

export class Enterprise {
  private database = new Database();

  constructor(private enterpriseForm: EnterpriseForm, private userUID: string) {}

  update() {
    return this.database
      .collection('enterprises')
      .update(this.enterpriseForm.enterpriseUID, {
        ...this.enterpriseForm.enterpriseData,
      })
      .then(() => this.storeOrganizationInFacturapi(this.enterpriseForm.enterpriseUID));
  }

  public store() {
    return this.database
      .collection('enterprises')
      .store({
        ...this.enterpriseForm.enterpriseData,
      })
      .then(async (response: any) => {
        await this.relationWithUser(response.id);
        await this.database.collection('enterprises').update(response.id, {
          uid: response.id,
        });
        return this.storeOrganizationInFacturapi(response.id);
      });
  }

  public relationWithUser(enterpriseUID: string) {
    return this.database.collection('users').update(this.userUID, {
      enterpriseUID,
    });
  }

  private async storeOrganizationInFacturapi(enterpriseUID: string) {
    try {
      return await new Organization().store(this.enterpriseForm, this.userUID, enterpriseUID);
    } catch (e) {
      console.warn(e);
    }
  }
}
