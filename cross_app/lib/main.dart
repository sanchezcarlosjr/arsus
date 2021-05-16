import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'services/auth/firebase_user_provider.dart';
import 'package:arsus/views/pages/home_page/home_page_widget.dart';
import 'package:arsus/views/apps/apps_page_widget.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  // This widget is the root of your application.
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
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
    return MaterialApp(
      title: 'Arsus',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: initialUser == null
          ? const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Color(0xff4b39ef)),
              ),
            )
          : currentUser.loggedIn
              ? AppsPageWidget()
              : HomePageWidget(),
    );
  }
}
