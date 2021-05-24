import { PageCreator } from '../../shared/PageCreator';

export class UABCScrapper {
  private readonly URL: string =
    'https://alumnos.uabc.mx/web/alumnos/bienvenido?p_p_id=com_liferay_login_web_portlet_LoginPortlet&p_p_lifecycle=0&p_p_state=maximized&refererPlid=49&saveLastPath=false&_com_liferay_login_web_portlet_LoginPortlet_redirect=%2Fgroup%2Falumnos%2Fhorario';

  constructor(private user: string, private password: string) {}

  async scrape(): Promise<string[][]> {
    const page = await PageCreator.getInstance(this.URL);
    await page.type('_com_liferay_login_web_portlet_LoginPortlet_login', this.user);
    await page.type('_com_liferay_login_web_portlet_LoginPortlet_password', this.password);
    await page.click('//*[@id="_com_liferay_login_web_portlet_LoginPortlet_INSTANCE_0_kjco"]');
    const scheduler: string[][] = [];
    for (let day = 0; day < 6; day++) {
      const total = await page.count(
        `/html/body/div[1]/div/section/div/section[4]/div/div/div/div/div/section/div/div/div/div/div[1]/div/div/div[2]/ul/li[${day}]/ul/li`
      );
      const courses: string[] = [];
      for (let course = 1; course < total + 1; course++) {
        const c: string = await page.read(
          `/html/body/div[1]/div/section/div/section[4]/div/div/div/div/div/section/div/div/div/div/div[1]/div/div/div[2]/ul/li[${day}]/ul/li[${course}]`
        );
        courses.push(c);
      }
      scheduler.push(courses);
    }
    return scheduler;
  }
}
