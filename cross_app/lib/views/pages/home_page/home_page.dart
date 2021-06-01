import 'package:arsus/services/auth/firebase_user_provider.dart';
import 'package:arsus/views/apps/apps_page_widget.dart';
import 'package:arsus/views/pages/home_page/news_component.dart';
import 'package:arsus/views/theme/theme.dart';
import 'package:arsus/views/theme/widgets.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';

import '../login_page/login_page_widget.dart';

class HomePageWidget extends StatefulWidget {
  HomePageWidget({Key key}) : super(key: key);

  @override
  _HomePageWidgetState createState() => _HomePageWidgetState();
}

class _HomePageWidgetState extends State<HomePageWidget> {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  Stream<ArsusFirebaseUser> userStream;
  ArsusFirebaseUser initialUser;

  @override
  void initState() {
    super.initState();
    userStream = arsusFirebaseUserStream()
      ..listen((user) => initialUser ?? setState(() => initialUser = user));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      appBar: AppBar(
        backgroundColor: Color(0x00F5F5F5),
        automaticallyImplyLeading: false,
        title:
            Text('Arsus', textAlign: TextAlign.start, style: ArsusTheme.title2),
        actions: initialUser != null && initialUser.loggedIn ?
        [
                Padding(
                    padding: EdgeInsets.fromLTRB(0, 0, 11, 11),
                    child: IconButton(
                      onPressed: () async {
                        await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => AppsPageWidget(),
                          ),
                        );
                      },
                      icon: Icon(
                        Icons.apps,
                        color: Colors.black,
                        size: 30,
                      ),
                      iconSize: 30,
                    )),
                Padding(
                    padding: EdgeInsets.fromLTRB(0, 0, 11, 11),
                    child: InkWell(
                        onTap: () async {
                          await FirebaseAuth.instance.signOut();
                        },
                        child: Container(
                            width: 40,
                            height: 40,
                            clipBehavior: Clip.antiAlias,
                            decoration: BoxDecoration(shape: BoxShape.circle),
                            child: CachedNetworkImage(
                                imageUrl:
                                initialUser.user != null ? initialUser.user.photoURL : 'https://image.flaticon.com/icons/png/512/2494/2494552.png',
                                fit: BoxFit.contain)))),
              ]
            : [
                FFButtonWidget(
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
              ],
        centerTitle: false,
        elevation: 0,
      ),
      body: Padding(
          padding: EdgeInsets.fromLTRB(0, 25, 0, 0), child: NewsComponent()),
    );
  }
}
