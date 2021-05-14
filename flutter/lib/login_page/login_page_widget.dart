import '../apps_page/apps_page_widget.dart';
import '../auth/auth_util.dart';
import '../flutter_flow/flutter_flow_theme.dart';
import '../flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';

class LoginPageWidget extends StatefulWidget {
  LoginPageWidget({Key key}) : super(key: key);

  @override
  _LoginPageWidgetState createState() => _LoginPageWidgetState();
}

class _LoginPageWidgetState extends State<LoginPageWidget> {
  TextEditingController emailTextController;
  TextEditingController passwordTextController;
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    emailTextController = TextEditingController();
    passwordTextController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      body: SafeArea(
        child: Stack(
          children: [
            Align(
              alignment: Alignment(0, -1),
              child: Image.network(
                'https://picsum.photos/seed/483/300',
                width: double.infinity,
                height: 250,
                fit: BoxFit.cover,
              ),
            ),
            Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(0, 230, 0, 0),
                    child: Container(
                      width: double.infinity,
                      height: 100,
                      decoration: BoxDecoration(
                        color: Color(0xFFEEEEEE),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: Padding(
                        padding: EdgeInsets.fromLTRB(0, 60, 0, 60),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Align(
                              alignment: Alignment(0, -0.65),
                              child: Padding(
                                padding: EdgeInsets.fromLTRB(0, 4, 0, 15),
                                child: Image.network(
                                  'https://firebasestorage.googleapis.com/v0/b/arsus-production.appspot.com/o/logo-transparent.png?alt=media&token=485a5c1c-a436-41f7-b126-57c6e3ce75bb',
                                  width: 50,
                                  height: 50,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            Padding(
                              padding: EdgeInsets.fromLTRB(0, 0, 0, 10),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Padding(
                                    padding: EdgeInsets.fromLTRB(4, 0, 0, 20),
                                    child: Container(
                                      width: 300,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Color(0xFFE0E0E0),
                                        borderRadius: BorderRadius.circular(0),
                                      ),
                                      child: Padding(
                                        padding:
                                            EdgeInsets.fromLTRB(20, 0, 20, 0),
                                        child: TextFormField(
                                          controller: emailTextController,
                                          obscureText: false,
                                          decoration: InputDecoration(
                                            hintText: 'Correo electrónico',
                                            hintStyle: GoogleFonts.getFont(
                                              'IBM Plex Sans',
                                              color: Color(0xFF455A64),
                                              fontWeight: FontWeight.normal,
                                            ),
                                            enabledBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Colors.transparent,
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            focusedBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Colors.transparent,
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                          ),
                                          style: GoogleFonts.getFont(
                                            'IBM Plex Sans',
                                            color: Color(0xFF455A64),
                                            fontWeight: FontWeight.normal,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.fromLTRB(4, 0, 4, 20),
                                    child: Container(
                                      width: 300,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Color(0xFFE0E0E0),
                                        borderRadius: BorderRadius.circular(0),
                                      ),
                                      child: Padding(
                                        padding:
                                            EdgeInsets.fromLTRB(20, 0, 20, 0),
                                        child: TextFormField(
                                          controller: passwordTextController,
                                          obscureText: true,
                                          decoration: InputDecoration(
                                            hintText: 'Contraseña',
                                            hintStyle: GoogleFonts.getFont(
                                              'IBM Plex Sans',
                                              color: Color(0xFF455A64),
                                              fontWeight: FontWeight.normal,
                                            ),
                                            enabledBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Colors.transparent,
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                            focusedBorder: UnderlineInputBorder(
                                              borderSide: BorderSide(
                                                color: Colors.transparent,
                                                width: 1,
                                              ),
                                              borderRadius:
                                                  const BorderRadius.only(
                                                topLeft: Radius.circular(4.0),
                                                topRight: Radius.circular(4.0),
                                              ),
                                            ),
                                          ),
                                          style: GoogleFonts.getFont(
                                            'IBM Plex Sans',
                                            color: Color(0xFF455A64),
                                            fontWeight: FontWeight.normal,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  Padding(
                                    padding: EdgeInsets.fromLTRB(0, 0, 0, 20),
                                    child: FFButtonWidget(
                                      onPressed: () async {
                                        final user = await signInWithEmail(
                                          context,
                                          emailTextController.text,
                                          passwordTextController.text,
                                        );
                                        if (user == null) {
                                          return;
                                        }

                                        await Navigator.pushAndRemoveUntil(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) =>
                                                AppsPageWidget(),
                                          ),
                                          (r) => false,
                                        );
                                      },
                                      text: 'Inicia sesión',
                                      options: FFButtonOptions(
                                        width: 300,
                                        height: 50,
                                        color: Color(0xFF0C0A59),
                                        textStyle: GoogleFonts.getFont(
                                          'IBM Plex Sans',
                                          color: Color(0xFFDEDEDE),
                                          fontSize: 16,
                                        ),
                                        borderSide: BorderSide(
                                          color: Color(0x000C0A59),
                                          width: 0,
                                        ),
                                        borderRadius: 0,
                                      ),
                                    ),
                                  ),
                                  Text(
                                    'O',
                                    style: GoogleFonts.getFont(
                                      'IBM Plex Sans',
                                      fontSize: 14,
                                    ),
                                  )
                                ],
                              ),
                            ),
                            Padding(
                              padding: EdgeInsets.fromLTRB(0, 0, 0, 20),
                              child: FFButtonWidget(
                                onPressed: () async {
                                  final user = await signInWithGoogle(context);
                                  if (user == null) {
                                    return;
                                  }
                                  await Navigator.pushAndRemoveUntil(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => AppsPageWidget(),
                                    ),
                                    (r) => false,
                                  );
                                },
                                text: 'Continua con Google',
                                icon: FaIcon(
                                  FontAwesomeIcons.google,
                                  color: Color(0xFF606060),
                                ),
                                options: FFButtonOptions(
                                  width: 300,
                                  height: 50,
                                  color: Colors.white,
                                  textStyle: GoogleFonts.getFont(
                                    'IBM Plex Sans',
                                    color: Color(0xFF606060),
                                    fontSize: 16,
                                  ),
                                  elevation: 4,
                                  borderSide: BorderSide(
                                    color: Color(0x00EEEEEE),
                                    width: 0,
                                  ),
                                  borderRadius: 0,
                                ),
                              ),
                            ),
                            Padding(
                              padding: EdgeInsets.fromLTRB(0, 0, 0, 20),
                              child: FFButtonWidget(
                                onPressed: () async {
                                  final user = null;
                                  if (user == null) {
                                    return;
                                  }
                                  await Navigator.pushAndRemoveUntil(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => AppsPageWidget(),
                                    ),
                                    (r) => false,
                                  );
                                },
                                text: 'Continua con Facebook',
                                icon: FaIcon(
                                  FontAwesomeIcons.facebookF,
                                  color: Color(0xFF606060),
                                ),
                                options: FFButtonOptions(
                                  width: 300,
                                  height: 50,
                                  color: Colors.white,
                                  textStyle: GoogleFonts.getFont(
                                    'IBM Plex Sans',
                                    color: Color(0xFF606060),
                                    fontSize: 16,
                                  ),
                                  elevation: 4,
                                  borderSide: BorderSide(
                                    color: Color(0x00EEEEEE),
                                    width: 0,
                                  ),
                                  borderRadius: 0,
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
