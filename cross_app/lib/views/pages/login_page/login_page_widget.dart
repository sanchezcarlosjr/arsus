import 'package:arsus/services/auth/email_auth.dart';
import 'package:arsus/services/auth/facebook_auth.dart';
import 'package:arsus/services/auth/google_auth.dart';

import '../../apps/apps_page_widget.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:arsus/views/theme/widgets.dart';
import 'package:flutter/material.dart';
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
        child: Padding(
          padding: EdgeInsets.fromLTRB(0, 60, 0, 60),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Align(
                alignment: Alignment(0, -0.65),
                child: Padding(
                  padding: EdgeInsets.fromLTRB(0, 5, 0, 0),
                  child: Image.network(
                    'https://firebasestorage.googleapis.com/v0/b/arsus-production.appspot.com/o/logo-transparent.png?alt=media&token=485a5c1c-a436-41f7-b126-57c6e3ce75bb',
                    width: 50,
                    height: 50,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsets.fromLTRB(0, 20, 0, 0),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
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
                          padding: EdgeInsets.fromLTRB(20, 0, 20, 0),
                          child: TextFormField(
                            controller: emailTextController,
                            obscureText: false,
                            decoration: InputDecoration(
                              labelText: 'Correo electrónico',
                              labelStyle: ArsusTheme.bodyText1.override(
                                color: Color(0xFF455A64),
                                fontWeight: FontWeight.normal,
                              ),
                              enabledBorder: UnderlineInputBorder(
                                borderSide: BorderSide(
                                  color: Colors.transparent,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.only(
                                  bottomLeft: Radius.circular(0),
                                  bottomRight: Radius.circular(0),
                                  topLeft: Radius.circular(0),
                                  topRight: Radius.circular(0),
                                ),
                              ),
                              focusedBorder: UnderlineInputBorder(
                                borderSide: BorderSide(
                                  color: Colors.transparent,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.only(
                                  bottomLeft: Radius.circular(0),
                                  bottomRight: Radius.circular(0),
                                  topLeft: Radius.circular(0),
                                  topRight: Radius.circular(0),
                                ),
                              ),
                            ),
                            style: ArsusTheme.bodyText1.override(
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
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Padding(
                          padding: EdgeInsets.fromLTRB(20, 0, 20, 0),
                          child: TextFormField(
                            controller: passwordTextController,
                            obscureText: true,
                            decoration: InputDecoration(
                              hintText: 'Contraseña',
                              hintStyle: ArsusTheme.bodyText1.override(
                                color: Color(0xFF455A64),
                                fontWeight: FontWeight.normal
                              ),
                              enabledBorder: UnderlineInputBorder(
                                borderSide: BorderSide(
                                  color: Colors.transparent,
                                  width: 1,
                                ),
                                borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(4.0),
                                  topRight: Radius.circular(4.0),
                                ),
                              ),
                              focusedBorder: UnderlineInputBorder(
                                borderSide: BorderSide(
                                  color: Colors.transparent,
                                  width: 1,
                                ),
                                borderRadius: const BorderRadius.only(
                                  topLeft: Radius.circular(4.0),
                                  topRight: Radius.circular(4.0),
                                ),
                              ),
                            ),
                            style:  ArsusTheme.bodyText1.override(
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
                          var user = await signInWithEmail(
                            context,
                            emailTextController.text,
                            passwordTextController.text,
                          );
                          if (user == null) {
                            await createAccountWithEmail(
                              context,
                              emailTextController.text,
                              passwordTextController.text,
                            );
                          }
                          await Navigator.pushAndRemoveUntil(
                            context,
                            MaterialPageRoute(
                              builder: (context) => AppsPageWidget(),
                            ),
                                (r) => false,
                          );
                        },
                        text: 'Inicia sesión',
                        options: FFButtonOptions(
                          width: 300,
                          height: 50,
                          color: ArsusTheme.primaryColor,
                          textStyle:  ArsusTheme.bodyText1.override(
                            color: Color(0xFFDEDEDE),
                            fontSize: 16,
                          ),
                          borderSide: BorderSide(
                            color: Colors.transparent,
                            width: 0,
                          ),
                          borderRadius: 0,
                        ),
                      ),
                    ),
                    Align(
                      alignment: Alignment(0, 0),
                      child: Container(
                        width: 300,
                        height: 44,
                        child: Stack(
                          children: [
                            Align(
                              alignment: Alignment(0, 0),
                              child: FFButtonWidget(
                                onPressed: () async {
                                  final user = await signInWithFacebook(context);
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
                                icon: Icon(
                                  Icons.add,
                                  color: Colors.transparent,
                                  size: 20,
                                ),
                                options: FFButtonOptions(
                                  width: 300,
                                  height: 44,
                                  color: Colors.white,
                                  textStyle:  ArsusTheme.bodyText1.override(
                                    color: Color(0xFF1877F2),
                                    fontSize: 17,
                                  ),
                                  elevation: 0,
                                  borderSide: BorderSide(
                                    color: Colors.transparent,
                                    width: 0,
                                  ),
                                  borderRadius: 0,
                                ),
                              ),
                            ),
                            Align(
                              alignment: Alignment(-0.83, 0),
                              child: Container(
                                width: 22,
                                height: 22,
                                clipBehavior: Clip.antiAlias,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                ),
                                child: Image.network(
                                  'https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512',
                                  fit: BoxFit.contain,
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    ),
                    Text(
                      'o',
                      style: ArsusTheme.bodyText1.override(
                        fontFamily: 'IBM Plex Sans',
                      ),
                    ),
                    Align(
                      alignment: Alignment(0, 0),
                      child: Container(
                        width: 300,
                        height: 44,
                        child: Stack(
                          children: [
                            Align(
                              alignment: Alignment(0, 0),
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
                                icon: Icon(
                                  Icons.add,
                                  color: Colors.transparent,
                                  size: 20,
                                ),
                                options: FFButtonOptions(
                                  width: 300,
                                  height: 44,
                                  color: Colors.white,
                                  textStyle:  ArsusTheme.bodyText1.override(
                                    color: Color(0xFF606060),
                                    fontSize: 17,
                                  ),
                                  elevation: 0,
                                  borderSide: BorderSide(
                                    color: Colors.transparent,
                                    width: 0,
                                  ),
                                  borderRadius: 0,
                                ),
                              ),
                            ),
                            Align(
                              alignment: Alignment(-0.83, 0),
                              child: Container(
                                width: 22,
                                height: 22,
                                clipBehavior: Clip.antiAlias,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                ),
                                child: Image.network(
                                  'https://i0.wp.com/nanophorm.com/wp-content/uploads/2018/04/google-logo-icon-PNG-Transparent-Background.png?w=1000&ssl=1',
                                  fit: BoxFit.contain,
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
