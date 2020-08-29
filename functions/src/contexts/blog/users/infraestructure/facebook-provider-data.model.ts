import { Database } from '../../../../database/database';

const request = require('request-promise');

export class FacebookProviderData {
  private database = new Database();
  private options = {
    uri: `https://graph.facebook.com/${this.userData.facebook.id}`,
    qs: {
      fields:
        'id,address,age_range,install_type,is_famedeeplinkinguser,is_shared_login,birthday,email,payment_pricepoints,favorite_athletes,favorite_teams,first_name,gender,hometown,inspirational_people,installed,languages,last_name,link,location,meeting_for,middle_name,name,name_format,public_key,quotes,security_settings,shared_login_upgrade_required_by,short_name,significant_other,sports,test_group,video_upload_limits,viewer_can_send_gift,accounts,albums,apprequestformerrecipients,apprequests,books,business_users,events,family,friends,games,groups,likes,live_encoders,live_videos,movies,music,photos,picture,promotable_events,television,videos,feed',
      access_token: this.userData.facebook.accessToken,
    },
    json: true,
  };

  constructor(private userData: any) {}

  async store() {
    const response = await request(this.options);
    return this.database.collection(`users/${this.userData.uid}/providers`).storeWith('facebook', response);
  }
}
