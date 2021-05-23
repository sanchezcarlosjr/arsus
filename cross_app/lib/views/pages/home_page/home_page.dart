import 'package:arsus/services/auth/firebase_user_provider.dart';
import 'package:arsus/views/apps/apps_page_widget.dart';
import 'package:arsus/views/pages/home_page/news_component.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:arsus/views/theme/widgets.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../login_page/login_page_widget.dart';
import 'package:flutter/material.dart';

class HomePageWidget extends StatefulWidget {
  HomePageWidget({Key key}) : super(key: key);

  @override
  _HomePageWidgetState createState() => _HomePageWidgetState();
}

class _HomePageWidgetState extends State<HomePageWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Color(0x00F5F5F5),
        automaticallyImplyLeading: false,
        title:
            Text('Arsus', textAlign: TextAlign.start, style: ArsusTheme.title2),
        actions: [
          Align(
            alignment: Alignment(0, 0),
            child: Padding(
              padding: EdgeInsets.fromLTRB(0, 0, 1, 0),
              child: FirebaseAuth.instance.currentUser != null
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        InkWell(
                            onTap: () async {
                              await Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => AppsPageWidget(),
                                ),
                              );
                            },
                            child: Icon(Icons.apps,
                                color: Colors.black12,
                                size: 30.0,
                                semanticLabel: 'Apps')),
                        InkWell(
                            onTap: () async {
                              await FirebaseAuth.instance.signOut();
                            },
                            child: Icon(Icons.logout,
                                color: Colors.black12,
                                size: 30.0,
                                semanticLabel: 'Sign out'))
                      ],
                    )
                  : FFButtonWidget(
                      onPressed: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => LoginPageWidget(),
                          ),
                        );
                      },
                      text: 'Inicia sesión',
                      options: FFButtonOptions(
                        width: 130,
                        height: 40,
                        color: Colors.white,
                        textStyle: ArsusTheme.subtitle2.override(
                          color: Color(0xFFFFB24D),
                        ),
                        borderSide: BorderSide(
                          color: Color(0xFFFFB24D),
                          width: 1,
                        ),
                        borderRadius: 0,
                      ),
                    ),
            ),
          )
        ],
        centerTitle: false,
        elevation: 0,
      ),
      body: Padding(
          padding: EdgeInsets.fromLTRB(0, 25, 0, 0), child: NewsComponent()),
    );
  }
}
